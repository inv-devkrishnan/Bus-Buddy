import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Button from "react-bootstrap/Button";
import { Container, Card, InputGroup, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import Swal from "sweetalert2";

import { GoogleLogin } from "@react-oauth/google";

import { useForm } from "react-hook-form";

import {
  login,
  loginWithGoogle,
  forgotPasswordSendEmail,
} from "../utils/apiCalls";
import {
  getForgotPasswordErrorMessages,
  getLoginErrorMessages,
} from "../utils/getErrorMessage";
import LoginSplash from "../assets/images/login_splash.jpg";

import { SeatContext } from "../utils/SeatContext";
import { useAuthStatus } from "../utils/hooks/useAuth";
import "../pages/login_page.css";
import { showLoadingAlert } from "../components/common/loading_alert/LoadingAlert";

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
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
    unregister("email");
    document.getElementById("forgot-password-form").reset();
  };
  const handleForgotPasswordShow = () => setShowForgotPassword(true);

  const {
    register,
    handleSubmit,
    trigger,
    unregister,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (authStatus) {
      navigate("/");
    }
  }, [authStatus, navigate]);
  useEffect(() => {
    // for displaying toast else clearing localstorage
    if (
      localStorage.getItem("current_trip") &&
      seatList.length > 0 &&
      localStorage.getItem("seat_list")
    ) {
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
    } else if (localStorage.getItem("current_trip")) {
      localStorage.removeItem("current_trip");
    }
  }, [seatList]);

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

  const forgotPasswordSendMail = async (data) => {
    // function to send forgotPasswordMail
    console.log(data);
    showLoadingAlert("Please Wait");
    const result = await forgotPasswordSendEmail(data);
    Swal.close();
    if (result.message?.message === "email sent") {
      Swal.fire({
        title: "Email Sent",
        text: "Check your inbox for a password reset mail",
        icon: "success",
      });
    } else if (result.message?.error_code) {
      Swal.fire({
        title: "Operation Failed",
        text: getForgotPasswordErrorMessages(result.message?.error_code),
        icon: "error",
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Unknown Error",
        icon: "error",
      });
    }
    handleForgotPasswordClose();
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
        navigate("/traveller-data", { replace: true });
      } else if (loginRes.message.user_role === 2) {
        navigate("/user-dashboard/profile");
      } else if (loginRes.message.user_role === 1) {
        navigate("/admin-dashboard/view-profile");
      } else {
        navigate("/BusHome/Ownerprofile");
      }
    } else {
      // if login fail's it shows the error message
      const error = loginRes?.message?.response?.data?.error_code;
      if (loginRes?.message?.response?.data?.error_code) {
        setErrorMessage(getLoginErrorMessages(error));
      }
    }
  };

  const handleLoginSubmit = (event) => {
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
    <Container style={{ height: "100vh" }}>
      <Row style={{ height: "100%" }}>
        <Col className="d-flex justify-content-center align-items-center hide-div">
          <Image src={LoginSplash} draggable={false} fluid></Image>
        </Col>
        <Col
          xl={6}
          lg={7}
          md={12}
          sm={12}
          xs={12}
          className="d-flex justify-content-center align-items-center"
        >
          <Card className="p-5 shadow-lg p-3 bg-body rounded">
            <h1 className="text-center">Login</h1>
            <Form noValidate validated={validated} onSubmit={handleLoginSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  maxLength={100}
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
                    data-testid="set-show-password"
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
              <Button
                data-testid="login-button"
                style={{ width: "100%" }}
                variant="primary"
                type="submit"
                className="mb-3"
              >
                Login
              </Button>
              <div className="d-flex justify-content-center">
                <Card.Link
                  data-testid="browse-guest"
                  onClick={() => {
                    browseAsGuest();
                  }}
                  style={{ display: "block", cursor: "pointer" }}
                >
                  Browse as guest
                </Card.Link>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <Card.Link
                  data-testid="forgot-password"
                  onClick={handleForgotPasswordShow}
                  style={{ display: "block", cursor: "pointer" }}
                >
                  Forgot Password ?
                </Card.Link>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <Card.Text>
                  <Dropdown>
                    <Dropdown.Toggle
                      data-testid="register"
                      variant="light"
                      className="text-primary"
                      id="dropdown-basic"
                    >
                      Not registered ?
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        data-testid="register-user"
                        onClick={() => {
                          navigate("/register-user");
                        }}
                      >
                        Register as user
                      </Dropdown.Item>
                      <Dropdown.Item
                        data-testid="register-owner"
                        onClick={() => {
                          navigate("/register-owner");
                        }}
                      >
                        Register as bus owner
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Text>
              </div>

              <Card.Text className="d-flex justify-content-around mt-0">
                or
              </Card.Text>
              <div className="d-flex justify-content-center">
                <GoogleLogin
                  data-testid="google-login"
                  onSuccess={authenicateGoogleUser}
                  onError={googleLoginFail}
                />
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
      <Modal
        show={showForgotPassword}
        onHide={handleForgotPasswordClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            id="forgot-password-form"
            onSubmit={handleSubmit(forgotPasswordSendMail)}
          >
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label> Enter the registered email id</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                maxLength={100}
                {...register("email", {
                  required: true,
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                })}
                onBlur={() => {
                  trigger("email");
                }}
              />
              {errors.email && errors.email.type === "required" && (
                <p className="text-danger mt-2"> * Email required</p>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <p className="text-danger mt-2"> * Email invalid</p>
              )}
            </Form.Group>
            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Send Email
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleForgotPasswordClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default LoginPage;
