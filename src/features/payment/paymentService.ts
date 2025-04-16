import paypal from "@paypal/checkout-server-sdk";
import { client } from "../../config/paypal";
import paypalPayouts from "@paypal/payouts-sdk";
import { Order } from "../order/orderModel";
import { AppDataSource } from "../../config/db";
import { OrderStatus } from "../order/orderStatus";
import { Vendor } from "../user/vendorModel";
import { VendorBalance } from "../vendor/vendorBalanceModel";
import { Transaction } from "../order/transactionModel";
import { TransactionStatus } from "../order/transactionStatus";
import { OrderLineStatus } from "../order/orderStatus";
import { Address } from "../address/addressModel";

export class PaymentService {
  async createPayPalOrderFromPendingOrder(orderId: string, selectedAddressId: string) {
    const orderRepo = AppDataSource.getRepository(Order);
    const addressRepo = AppDataSource.getRepository(Address);
    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: ["orderLines", "orderAddress"],
    });
    if (!order) throw new Error("Order not found");

    const address = await addressRepo.findOneBy({ id: selectedAddressId });
    if (!address) throw new Error("Address not found");
    order.orderAddress = address;
    await orderRepo.save(order);

    const totalAmount = order.orderLines?.reduce(
      (sum, ol) => sum + parseFloat(ol.unitPrice.toString()),
      0
    );
    if (!totalAmount) {
      throw Error("Invalid order");
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order.id,
          amount: {
            currency_code: "CAD",
            value: totalAmount.toFixed(2),
          },
          payee: {
            email_address: process.env.ADMIN_PAYPAL_EMAIL,
          },
        },
      ],
    });

    const response = await client.execute(request);
    return { id: response.result.id }; // Send this to the frontend for PayPal button
  }

  async capturePayment(paypalOrderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    const response = await client.execute(request);
    const referenceId = response.result.purchase_units[0].reference_id;

    const updatedOrder = await this.confirmOrder(referenceId, paypalOrderId);

    return updatedOrder;
  }

  async confirmOrder(orderId: string, paypalOrderId: string) {
    const repo = AppDataSource.getRepository(Order);
    const order = await repo.findOne({ where: { id: orderId } });

    if (!order) throw new Error("Order not found");

    order.status = OrderStatus.confirmed;
    order.paypalOrderId = paypalOrderId;

    return repo.save(order);
  }

  async payout(vendorEmail: string, amount: string) {
    const currency = "CAD";

    const request = new paypalPayouts.payouts.PayoutsPostRequest();
    request.requestBody({
      sender_batch_header: {
        sender_batch_id: `batch-${Date.now()}`,
        email_subject: "You have received a payment!",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            currency,
            value: amount,
          },
          receiver: vendorEmail,
        },
      ],
    });
    const response = await client.execute(request);
    return response.result;
  }

  async payoutToVendor(vendorId: string, amount: number) {
    const vendorBalanceRepo = AppDataSource.getRepository(VendorBalance);
    const transactionRepo = AppDataSource.getRepository(Transaction);
    const vendorRepo = AppDataSource.getRepository(Vendor);
    const vendor = await vendorRepo.findOne({ where: { id: vendorId } });
    if (!vendor) throw new Error("Vendor not found");

    let balance = await vendorBalanceRepo.findOne({
      where: { vendor: { id: vendor.id } },
    });
    if (!balance) throw new Error("Vendor balance not found");

    if (balance.pendingPayout < amount)
      throw new Error("Insufficient pending payout");

    balance.pendingPayout -= amount;
    balance.totalPaid += amount;
    await vendorBalanceRepo.save(balance);

    const transaction = transactionRepo.create({
      vendor,
      amount,
      type: TransactionStatus.debit,
    });
    await transactionRepo.save(transaction);
    const payoutResult = await this.payout(
      vendor.user.email,
      amount.toFixed(2)
    ); // PayPal needs string

    return payoutResult;
  }

  async processOfflinePayment(orderId: string, selectedAddressId: string) {
    const orderRepo = AppDataSource.getRepository(Order);
    const addressRepo = AppDataSource.getRepository(Address);
    const order = await orderRepo.findOne({
      where: { id: orderId },
      relations: ["orderLines", "orderAddress"],
    });

    if (!order) throw new Error("Order not found");

    const address = await addressRepo.findOneBy({ id: selectedAddressId });
    if (!address) throw new Error("Address not found");
    order.orderAddress = address;

    order.status = OrderStatus.offlinePayment;

    if (order.orderLines) {
      order.orderLines.forEach((orderLine) => {
        orderLine.status = OrderLineStatus.offlinePayment;
      });
    }

    await orderRepo.save(order);

    return order;
  }
}
