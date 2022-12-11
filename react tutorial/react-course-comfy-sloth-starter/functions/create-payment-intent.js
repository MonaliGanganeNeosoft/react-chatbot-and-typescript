//domain/.netlify/functions/create-payment-intent

require("dotenv").config();
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

// const items = [
//   { id: 1, name: "moni" },
//   { id: 2, name: "susan" },
// ];
exports.handler = async function (event, context) {
  if (event.body) {
    const { cart, shipping_fee, total_amount } = JSON.parse(event.body);

    const calculateOrderAmount = () => {
      return shipping_fee + total_amount;
    };
    // console.log(cart);
    //   console.log(event);

    // return {
    //     statusCode: 200,
    //     // body: JSON.stringify(items),
    //     // body: "payment intent",
    //     body: JSON.stringify(cart),
    //   };
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        description: "Software development services",
        shipping: {
          name: "Jenny Rosen",
          address: {
            line1: "510 Townsend St",
            postal_code: "98140",
            city: "San Francisco",
            state: "CA",
            country: "US",
          },
        },
        amount: calculateOrderAmount(),
        currency: "usd",

        payment_method_types: ["card"],
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      };
    } catch (error) {}
  }
  return {
    statusCode: 200,
    body: "Create Payment Intent",
  };
};
