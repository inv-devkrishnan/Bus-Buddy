import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";
import { Container, Card, InputGroup } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import Swal from "sweetalert2";

import { GoogleLogin } from "@react-oauth/google";

import { login, loginWithGoogle } from "../utils/apiCalls";
import { getErrorMessage } from "../utils/getErrorMessage";
import LoginSplash from "../assets/images/login_splash.jpg";

import { SeatContext } from "../utils/SeatContext";
import { useAuthStatus } from "../utils/hooks/useAuth";

function LoginPage() {
  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { seatList } = useContext(SeatContext);
  console.log(seatList);
  const authStatus = useAuthStatus();
  useEffect(() => {
    if (authStatus()) {
      navigate("/");
    }
  }, [authStatus, navigate]);
  useEffect(() => {
    if (localStorage.getItem("current_trip") && seatList.length > 0) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "info",
        title: "Sign in as User to continue booking",
      });
    }
  }, []);

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
      localStorage.setItem("user_name", loginRes.message.user_name);

      if (localStorage.getItem("current_trip") && seatList.length > 0) {
        navigate("/traveller-data");
      } else if (loginRes.message.user_role === 2) {
        navigate("/user-dashboard");
      } else if (loginRes.message.user_role === 1) {
        navigate("/admin-dashboard");
      } else {
        navigate("/BusHome");
      }
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

  const browseAsGuest = () => {
    // enables to view website in guest mode
    localStorage.clear();
    navigate("/");
  };
  return (
    <Container fluid className="mt-5">
      <Row>
        <Col>
          <Image src={LoginSplash} draggable={false} fluid></Image>
        </Col>
        <Col lg={6} md={8} sm={12}>
          <Card className="p-5 shadow-lg p-3 mb-5 bg-body rounded">
            <h1>Login</h1>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  maxLength={254}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                  style={{ backgroundImage: "none" }}
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
                    maxLength={100}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    required
                    style={{ backgroundImage: "none" }}
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
              <Card.Link
                onClick={() => {
                  browseAsGuest();
                }}
                className="ms-3"
                style={{ cursor: "pointer" }}
              >
                Browse as guest
              </Card.Link>
              <Card.Text>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    className="text-primary"
                    id="dropdown-basic"
                  >
                    Not registered ?
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        navigate("/register-user");
                      }}
                    >
                      Register as user
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        navigate("/register-owner");
                      }}
                    >
                      Register as bus owner
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Text>
              <Card.Text className="d-flex justify-content-around mt-0">
                or
              </Card.Text>
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
