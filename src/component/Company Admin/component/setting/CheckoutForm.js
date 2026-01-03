import React from "react";
import { Button, Form, Card, Container } from "react-bootstrap";
// import "./card.css";

import {
  CardElement,
} from "@stripe/react-stripe-js";

export default class CheckoutForm extends React.Component {
  handleSubmit = async (event) => {
    event.preventDefault();
    const { stripe, elements } = this.props;
    if (elements == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
  };

  render() {
    const { stripe } = this.props;
    return (
      <>
        <Container>
          <Card.Header>Add Card</Card.Header>
          <Card>
            <Card.Body>
              <Form onSubmit={this.handleSubmit}>
                <CardElement />
                <Form.Group className="mb-3" controlId="formGroupEmail">
                  <Button type="submit" disabled={!stripe}>
                    Save
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
}
