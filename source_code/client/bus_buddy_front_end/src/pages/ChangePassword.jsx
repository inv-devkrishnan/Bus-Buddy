import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import Swal from "sweetalert2";

import { useAuthStatus } from "../utils/hooks/useAuth";
import { changePassword } from "../utils/apiCalls";
import { useLogout } from "../utils/hooks/useLogout";
import { getErrorMessage } from "../utils/getErrorMessage";
import { showLoadingAlert } from "../components/common/loading_alert/LoadingAlert";

function ChangePassword() {
  const navigate = useNavigate();
  const authStatus = useAuthStatus();

  useEffect(() => {
    if (!authStatus()) {
      // if user not logged in redirect to login page
      navigate("/login");
    }

    if (localStorage.getItem("account_provider") === "1") {
      navigate("/login"); // if user is a google user redirect to login page
    }
  }, [authStatus, navigate]);

  const [validated, setValidated] = useState(false);
  const [oldpassword, setOldpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [renterpassword, setRenterpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const passwordMatched = useRef(true);
  const oldNotNewPassword = useRef(true);
  const logout = useLogout();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      // checks if old password not equals to new and re enter password matches
      if (passwordMatched.current && oldNotNewPassword.current) {
        setErrorMessage("");
        changeUserPassword();
      }
    }

    setValidated(true);
  };

  const checkPasswordMatch = (e) => {
    // function to check if re enter password matches with new password
    if (e.target.value === newpassword) {
      passwordMatched.current = true;
    } else {
      passwordMatched.current = false;
    }
    setRenterpassword(e.target.value);
  };
  const checkOldNotNewPassword = (e) => {
    // function to check if old password is not equals to new password
    if (e.target.value === oldpassword) {
      oldNotNewPassword.current = false;
    } else {
      oldNotNewPassword.current = true;
    }
    // sets renter password to empty if new password changes
    setRenterpassword("");
    setNewpassword(e.target.value);
  };

  const changeUserPassword = async () => {
    // function that calls api to change user password
    if (authStatus()) {
      const passwordData = {
        old_password: oldpassword,
        new_password: newpassword,
      };
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
          setErrorMessage(getErrorMessage(error));
        }
      }
    } else {
      navigate("/login");
    }
  };
  return (
    <Container fluid className="mt-3 mb-5">
      <Row>
        <Col xs={8} md={6}>
          <h1>Change password</h1>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="ms-3 mt-3"
          >
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label> Old password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Old Password"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\+\-\{\}\[\]:;<>,\.\?~\\\/]).{8,20}$"
                value={oldpassword}
                onChange={(e) => {
                  setOldpassword(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid password.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>New password</Form.Label>
              <Form.Control
                type="password"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\+\-\{\}\[\]:;<>,\.\?~\\\/]).{8,20}$"
                placeholder="New Password"
                value={newpassword}
                onChange={checkOldNotNewPassword}
                isInvalid={!oldNotNewPassword.current}
                required
              />
              <Form.Control.Feedback type="invalid">
                {oldNotNewPassword.current
                  ? "Please enter a valid password"
                  : "New password can't be same as old"}
              </Form.Control.Feedback>
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Re enter password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re enter Password"
                value={renterpassword}
                onChange={checkPasswordMatch}
                isInvalid={!passwordMatched.current}
                required
              />
              <Form.Control.Feedback type="invalid">
                Password doesn't match
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Text className="text-danger d-block">
              {errorMessage}
            </Form.Text>
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
            <div className="d-flex justify-content-center">
              <ul>
                <li>8 ~ 20 characters</li>
                <li>Atleast one Capital-case letter in English (A B C … Z) </li>
                <li>Atleast one Lower-case letter in English (a b c … z)</li>
                <li>Atleast one Number (0 1 2 … 9)</li>
                <li>Atleast one Special characters (! @ # ...)</li>
              </ul>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default ChangePassword;
