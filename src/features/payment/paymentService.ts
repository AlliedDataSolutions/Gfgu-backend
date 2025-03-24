import paypal from "@paypal/checkout-server-sdk";
import { client } from "@src/config/paypal";

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
}
