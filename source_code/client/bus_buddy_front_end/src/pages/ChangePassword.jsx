

import { useForm } from "react-hook-form";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import Swal from "sweetalert2";

import { changePassword } from "../utils/apiCalls";
import { useLogout } from "../utils/hooks/useLogout";
import { getErrorMessage } from "../utils/getErrorMessage";
import { showLoadingAlert } from "../components/common/loading_alert/LoadingAlert";
import PasswordRequirements from "../components/common/password_requirements/PasswordRequirements";

function ChangePassword() {
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm();

  const logout = useLogout();

  const submitData = (data) => {
    let passwordData = {
      old_password: data["old_password"],
      new_password: data["new_password"],
    };
    changeUserPassword(passwordData);
  };

  const changeUserPassword = async (passwordData) => {
    // function that calls api to change user password
      showLoadingAlert("Changing Password");
      const response = await changePassword(passwordData);
      Swal.close();
      if (response.status) {
        await Swal.fire({
          icon: "success",
          title: "Password Changed Successfully",
          text: "Now you will be redirected to login page",
        }); // shows the logout modal
        logout();
      } else {
        const error = response?.message?.response?.data?.error_code;
        if (error) {
          await Swal.fire({
            icon: "error",
            title: "Password Change Failed",
            text: getErrorMessage(error),
          });
        }
      }
  };
  return (
    <Container fluid className="mt-3 mb-5">
      <Row>
        <Col xs={8} md={6}>
          <h1>Change password</h1>
          <Form
            noValidate
            onSubmit={handleSubmit(submitData)}
            className="ms-3 mt-3"
          >
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label> Old password</Form.Label>
              <Form.Control
                type="password"
                maxLength={20}
                placeholder="Old Password"
                {...register("old_password", {
                  required: true,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~/\\]).{8,20}$/,
                })}
                onBlur={() => {
                  trigger("old_password");
                }}
              />
              {errors.old_password &&
                errors.old_password.type === "required" && (
                  <p className="text-danger">* required field</p>
                )}
              {errors.old_password &&
                errors.old_password.type === "pattern" && (
                  <p className="text-danger">
                    password doesn't meet the criteria
                  </p>
                )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>New password</Form.Label>
              <Form.Control
                type="password"
                maxLength={20}
                placeholder="New Password"
                {...register("new_password", {
                  required: true,
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~/\\]).{8,20}$/,
                  validate: (value) => value !== getValues("old_password")  
                })}
                onBlur={() => {
                  trigger("new_password");
                }}
              />
              {errors.new_password &&
                errors.new_password.type === "required" && (
                  <p className="text-danger">* required field</p>
                )}
              {errors.new_password &&
                errors.new_password.type === "pattern" && (
                  <p className="text-danger">
                    password doesn't meet the criteria
                  </p>
                )}
               {errors.new_password && errors.new_password.type === "validate" && (
                <p className="text-danger">new password can't be same as old password</p>
              )} 
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Re enter password</Form.Label>
              <Form.Control
                type="password"
                maxLength={20}
                placeholder="Re enter Password"
                {...register("re_password", {
                  required: true,
                  validate: (value) => value === getValues("new_password"),
                })}
                onBlur={() => {
                  trigger("re_password");
                }}
              />
              {errors.re_password &&
                errors.re_password.type === "required" && (
                  <p className="text-danger">* required field</p>
                )}
              {errors.re_password && errors.re_password.type === "validate" && (
                <p className="text-danger">password doesn't match</p>
              )}
            </Form.Group>
            <Button variant="success mt-2" type="submit">
              Change Password
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          <Card className="p-3 m-2 mt-5" style={{ width: "100%" }}>
            <Card.Title className="text-center">
              Password Requirements
            </Card.Title>
            <PasswordRequirements/>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default ChangePassword;
