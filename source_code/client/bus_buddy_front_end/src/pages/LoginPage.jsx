import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";
import { Container, Card, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import { GoogleLogin } from "@react-oauth/google";

import { login, loginWithGoogle } from "../utils/apiCalls";
import { getErrorMessage } from "../utils/getErrorMessage";
import LoginSplash from "../assets/images/login_splash.jpg";

function LoginPage() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const authenicateGoogleUser = async (response) => {
    // cred_token provided by google (use this as valid_cred_token in test.py of account_manage)
    console.log(response);
    const credToken = {
      cred_token: response.credential,
    };
    // api call to authenticate a google user
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
    // api call to authenticate a local user
    const loginRes = await login(userCredentials);
    loginResponse(loginRes);
  };

  const loginResponse = (loginRes) => {
    // function which is reponsible for showing error and success messages after login
    if (loginRes.status) {
      // if login success sets refresh,access,expiration time,user role, account provider in localstorage
      setErrorMessage("");
      localStorage.setItem("refresh_token", loginRes.message.refresh);
      localStorage.setItem("user_role", loginRes.message.user_role);
      localStorage.setItem(
        "account_provider",
        loginRes.message.account_provider
      );
      sessionStorage.setItem("access_token", loginRes.message.access);
      const expire_time =
        Number(loginRes.message.refresh_token_expire_time) + Date.now();
      localStorage.setItem("token_expire_time", expire_time);
      if(loginRes.message.user_role===2){
      navigate("/user-dashboard");}
      else if(loginRes.message.user_role ===1)
      {navigate("/admin-dashboard")}
      else
      {navigate("/");}
    } else {
      // if login fail's it shows the error message
      const error = loginRes?.message?.response?.data?.error_code;
      if (loginRes?.message?.response?.data?.error_code) {
        setErrorMessage(getErrorMessage(error));
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
        <Col>
          <Image src={LoginSplash} fluid></Image>
        </Col>
        <Col>
          <Card className="p-5 shadow-lg p-3 mb-5 bg-body rounded" >
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
                  style={{backgroundImage: "none"}}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Email.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                    style={{backgroundImage: "none"}}
                  />
                  <InputGroup.Text
                    id="basic-addon1"
                    onClick={() => {
                      showPassword
                        ? setShowPassword(false)
                        : setShowPassword(true);
                    }}
                  >
                    {showPassword ? <EyeSlash></EyeSlash> : <Eye></Eye>}
                  </InputGroup.Text>
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid Password.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Label className="d-block text-danger text-center">
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
