import {
  Col,
  Container,
  Row,
  Card,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import PasswordRequirements from "../components/common/password_requirements/PasswordRequirements";
import { useEffect, useCallback, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { openAxiosApi } from "../utils/axiosApi";
import { ExclamationCircleFill, Eye, EyeSlash } from "react-bootstrap-icons";
import Swal from "sweetalert2";
import { getForgotPasswordErrorMessages } from "../utils/getErrorMessage";
import { showLoadingAlert } from "../components/common/loading_alert/LoadingAlert";
function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validToken, setValidToken] = useState("");
  const [showRePassword, setShowRePassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const getTokenFromUrl = useCallback(() => {
    // function to extract token from url
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    return token;
  }, [location]);

  const verifyToken = useCallback(async () => {
    // function to verify token
    const token = getTokenFromUrl();
    const tokenData = {
      token: token,
    };
    if (token) {
      await openAxiosApi
        .post("account/forgot-password-verify/", tokenData)
        .then((result) => {
          if (result.data?.is_token_valid === true) {
            setIsTokenValid(true);
            setValidToken(token); // stores the valid token for future use
          } else {
            setIsTokenValid(false);
          }
        })
        .catch(function (error) {
          setIsTokenValid(false);
        });
    } else {
      setIsTokenValid(false);
    }

    setIsLoading(false);
  }, [getTokenFromUrl]);
  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const submitData = async (data) => {
    // function to change password
    console.log(data);
    const changePasswordData = {
      token: validToken,
      new_password: data.new_password,
    };
    showLoadingAlert("Please wait");
    await openAxiosApi
      .put("account/forgot-password-change/", changePasswordData)
      .then((result) => {
        Swal.close();
        if (result.data?.message === "password changed") {
          Swal.fire({
            title: "Password Changed",
            text: "Now you can login with new password",
            icon: "success",
          });
          navigate("/login", { replace: true });
        } else if (result.data?.error_code) {
          Swal.fire({
            title: "Password Change Failed",
            text: getForgotPasswordErrorMessages(result.data?.error_code),
            icon: "error",
          });
          if (result.data?.error_code === "D1032") {
            navigate("/login", { replace: true });
          } else {
            console.log("session not expired");
          }
        }
      })
      .catch(function (error) {
        Swal.close();
        Swal.fire({
          title: "Password Change Failed",
          text: "Unknown Error Occured",
          icon: "error",
        });
      });
  };
  return (
    <Container className="mt-3">
      <Row className="d-flex justify-content-center">
        <Col className="d-flex justify-content-center">
          {!isLoading && (
            <Card className="d-flex justify-content-center p-3">
              {isTokenValid ? (
                <Container>
                  <Row className="mb-3">
                    <Col>
                      <h1 className="text-center">Reset Password</h1>
                    </Col>
                  </Row>
                  <Row>
                    <Col xl={6}>
                      <Form
                        noValidate
                        onSubmit={handleSubmit(submitData)}
                        className="ms-3 mt-3"
                      >
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        ></Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>New password</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showNewPassword ? "text" : "password"}
                              id="new_pass_word"
                              maxLength={20}
                              placeholder="New Password"
                              {...register("new_password", {
                                required: true,
                                pattern:
                                  /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~/\\]).{8,20}$/,
                              })}
                              onBlur={() => {
                                trigger("new_password");
                                document.getElementById("re_pass_word").value && trigger("re_password")  
                              }}
                            />
                            <InputGroup.Text
                              id="basic-addon1"
                              data-testid="set-show-newpassword"
                              onClick={() => {
                                showNewPassword
                                  ? setShowNewPassword(false)
                                  : setShowNewPassword(true);
                              }}
                            >
                              {showNewPassword ? (
                                <EyeSlash></EyeSlash>
                              ) : (
                                <Eye></Eye>
                              )}
                            </InputGroup.Text>
                          </InputGroup>

                          {errors.new_password &&
                            errors.new_password.type === "required" && (
                              <p className="text-danger">* Required field</p>
                            )}
                          {errors.new_password &&
                            errors.new_password.type === "pattern" && (
                              <p className="text-danger">
                                Password doesn't meet the criteria
                              </p>
                            )}
                        </Form.Group>
                        <Form.Group
                          className="mb-3"
                          controlId="formBasicPassword"
                        >
                          <Form.Label>Re enter password</Form.Label>
                          <InputGroup>
                            <Form.Control
                              type={showRePassword ? "text" : "password"}
                              id="re_pass_word"
                              maxLength={20}
                              placeholder="Re enter Password"
                              {...register("re_password", {
                                required: true,
                                validate: (value) =>
                                  value === getValues("new_password"),
                              })}
                              onBlur={() => {
                                trigger("re_password");
                              }}
                            />
                            <InputGroup.Text
                              id="basic-addon2"
                              data-testid="set-show-repassword"
                              onClick={() => {
                                showRePassword
                                  ? setShowRePassword(false)
                                  : setShowRePassword(true);
                              }}
                            >
                              {showRePassword ? (
                                <EyeSlash></EyeSlash>
                              ) : (
                                <Eye></Eye>
                              )}
                            </InputGroup.Text>
                          </InputGroup>

                          {errors.re_password &&
                            errors.re_password.type === "required" && (
                              <p className="text-danger">* Required field</p>
                            )}
                          {errors.re_password &&
                            errors.re_password.type === "validate" && (
                              <p className="text-danger">
                                Password doesn't match
                              </p>
                            )}
                        </Form.Group>
                        <Button variant="success mt-2" type="submit">
                          Change Password
                        </Button>
                      </Form>
                    </Col>
                    <Col xl={6}>
                      <Card className="w-100">
                        <Card.Title className="text-center mb-3">
                          Password Requirements
                        </Card.Title>
                        <PasswordRequirements />
                      </Card>
                    </Col>
                  </Row>
                </Container>
              ) : (
                <Container style={{ height: "90vh" }}>
                  <Row className="h-50 d-flex align-items-end">
                    <ExclamationCircleFill size={60}></ExclamationCircleFill>
                  </Row>
                  <Row className="h-50">
                    <Col>
                      <h5 className="text-center mt-5">
                        Session is invalid or has been expired
                      </h5>
                    </Col>
                  </Row>
                </Container>
              )}
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}
export default ForgotPasswordPage;
