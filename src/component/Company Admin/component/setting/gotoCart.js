import React from "react";
import ReactDOM from "react-dom";

import {
  Elements,
  PaymentElement,
  ElementsConsumer,
  CardElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const InjectedCheckoutForm = () => (
  <ElementsConsumer>
    {({ stripe, elements }) => (
      <CheckoutForm stripe={stripe} elements={elements} />
    )}
  </ElementsConsumer>
);

const stripePromise = loadStripe(
  "pk_test_51KOIQMSEc5I4keAZHrzRG5nxzbzy101GcOrAXxhtxHdYz1CPCM6GJrnKEKJHNFRG2zEDev3rFT7t4XN0RkrXqiWg00x4gto4Wc"
);
function App() {
  const options = {
    // passing the client secret obtained from the server
    clientSecret:
      "pi_3KON0aSEc5I4keAZ1U0WZHIR_secret_f1c0exLCRM5RRNJcBiuWcSKyp",
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <InjectedCheckoutForm />
    </Elements>
  );
}

export default App;
