import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  useElements,
  PaymentElement,
  useStripe,
} from "@stripe/react-stripe-js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container, Button, Card } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Swal from "sweetalert2";
import { axiosApi } from "../../../utils/axiosApi";
import { useState } from "react";
function CardPayment(props) {
  const stripe = useStripe(); // using stripe hook  initialize stripe
  const elements = useElements();  // using elements hook to initialize element
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // to check wether a payment is ongoing

  const bookSeat = async (paymentIntentId) => {
    // function to book seat and added payment info to db
    let newData = props.data;
    let payment ={
      payment_intend : paymentIntentId,     
      status : 0,
    }
    newData['payment'] = payment;  // appends payment info to existing booking data
    axiosApi
      .post("user/book-seat/", newData)
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "Seat booked successfully",
          icon: "success",
        });

        localStorage.removeItem("pick_up");
        localStorage.removeItem("drop_off");
        localStorage.removeItem("total_amount");
        localStorage.removeItem("seat_list");
        localStorage.removeItem("current_trip");

        navigate("/user-dashboard", { replace: true }); // clears previous history
      })
      .catch((err) => {
        Swal.fire({
          title: "Oops!!",
          text: err.response.data,
          icon: "error",
        });
      });
  };

  const dopay = async (e) => {
    // function to perform payment on stripe
    
    e.preventDefault();   

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsLoading(true); // payment is ongoing
    await elements.submit().then(async function(result){
    if(result.error)
    {
      console.log(result.error)
    }
    else
    {
      const result = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {},
        redirect: "if_required",
      });
  
      console.log(result);
      if (result.error) {
        // Show error to your customer (for example, payment details incomplete)
        console.log(result.error.message);
        Swal.fire({
          title: "Payment Failed !",
          text: result.error.message,
          icon: "error",
        });
      } else {
        const paymentIntentId = result?.paymentIntent?.id
        bookSeat(paymentIntentId);
      }
    }
    });
   
    setIsLoading(false); // payment completed
  };

  return (
    <Container>
      <Row>
        <Col className="mt-3">
          <h1>Make Payment</h1>
        </Col>
      </Row>
      <Row>
        <div className="d-flex justify-content-center">
          <Card className="p-5 shadow-lg">
            <h3 className="text-center mb-3">
              Payment Amount : ₹ {props.data.total_amount}
            </h3>
            <form onSubmit={dopay} className="ml-auto mr-auto">
              <PaymentElement></PaymentElement>
              <Button
                className="mt-3"
                type="submit"
                disabled={isLoading || !stripe || !elements}
              >
                {isLoading ? (
                  <div>
                    <Spinner
                      as="span"
                      animation="grow"
                      size="sm"
                      role="output"
                      aria-hidden="true"
                    />
                    Loading...
                  </div>
                ) : (
                  "Pay Amount"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </Row>
    </Container>
  );
}
CardPayment.propTypes ={
  data : PropTypes.object,
}
export default CardPayment;
