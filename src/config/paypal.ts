import paypal from "@paypal/checkout-server-sdk";

const clientID = process.env.PAYPAL_CLIENT_ID || "";
const paypalSecret = process.env.PAYPAL_SECRET || "";

const environment = new paypal.core.SandboxEnvironment(clientID, paypalSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export { client };
