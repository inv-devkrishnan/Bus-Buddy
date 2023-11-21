import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CardPayment from "../components/User/payment/CardPayment";
import { useEffect } from "react";
import { useAuthStatus } from "../utils/hooks/useAuth";
function PaymentPage() {
  const location = useLocation();
  const val = process.env.REACT_APP_STRIPE_API_KEY;
  const stripePromise = loadStripe(val);
  const authStatus = useAuthStatus();
  const navigate = useNavigate();
  const options = {
    // passing the client secret obtained from the server
    clientSecret: location?.state?.clientSecret,
  };

  useEffect(() => {
    if (authStatus()) {
      if (location.state === null) {
        // if payment is false navigate to home
        navigate("/");
      }
    } else {
      navigate("/login"); // if user not logged in redirect to login
    }
  }, [navigate, authStatus, location]);

  return (
    <Elements stripe={stripePromise} options={options}>
      {location.state !== null && <CardPayment data={location?.state?.data} />}
    </Elements>
  );
}
export default PaymentPage;
