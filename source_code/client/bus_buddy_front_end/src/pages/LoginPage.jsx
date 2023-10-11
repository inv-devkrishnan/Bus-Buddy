import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from 'react-bootstrap/Card';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { GoogleLogin } from "@react-oauth/google";
import { login, loginWithGoogle } from "../utils/loginApiCalls";

function LoginPage() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [isHidden, setIsHidden] = useState(true);

  const authenicateGoogleUser = async (response) => {
    console.log(response);
    const credToken = {
      cred_token: response.credential,
    };

    const loginRes = await loginWithGoogle(credToken);
    loginResponse(loginRes);
  };

  const googleLoginFail = (error) => {
    console.log(error);
  };

  const authenicateUser = async () => {
    const userCredentials = {
      email: email,
      password: password,
    };
    const loginRes = await login(userCredentials);
    loginResponse(loginRes);
  };

  const loginResponse = (loginRes) => {
    if (loginRes.status) {
      setIsHidden(true);
      localStorage.setItem("loggedIn", "1"); // sets user is logged in
      navigate("/");
    } else {
      const error = loginRes?.message?.response?.data?.error_code;
      if (loginRes?.message?.response?.data?.error_code) {
        switch (error) {
          case "D1000":
            setErrorMessage("Invalid Login Credentials");
            break;
          case "D1001":
            setErrorMessage(
              "User doesn't exist or use different sign in method"
            );
            break;
          case "D1002":
            setErrorMessage("Data validation failed");
            break;
          case "G1003":
            setErrorMessage("Unauthorized client (google auth)");
            break;
          case "G1004":
            setErrorMessage("token expired (google auth)");
            break;
          case "G1005":
            setErrorMessage("token invalid (google auth)");
            break;
          default:
            setErrorMessage("Unknown Error");
        }
        setIsHidden(false);
      }
    }
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      authenicateUser();
    }

    setValidated(true);
  };
  return (
    <Container className="mt-5">
      <Row>
        <Col></Col>
        <Col>
        <Card className="p-5">

       
          <h1>Login</h1>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </Form.Group>
            <Form.Label
              className="d-block text-danger text-center"
              visuallyHidden={isHidden}
            >
              {errorMessage}
            </Form.Label>
            <Button variant="primary" type="submit" className="mb-3">
              Login
            </Button>
            <GoogleLogin
              onSuccess={authenicateGoogleUser}
              onError={googleLoginFail}
            />
          </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default LoginPage;
