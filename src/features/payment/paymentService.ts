import paypal from "@paypal/checkout-server-sdk";
import { client } from "../../config/paypal";
import paypalPayouts from "@paypal/payouts-sdk";

export class PaymentService {
  async createOrder(amount: string) {
    const currency = "CAD";

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount,
          },
          payee: {
            email_address: process.env.ADMIN_PAYPAL_EMAIL,
          },
        },
      ],
    });
    const response = await client.execute(request);
    return { id: response.result.id };
  }

  // admin to send money to vendors.
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
}
