import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";

import { useAuthStatus } from "../utils/hooks/useAuth";
import { changePassword } from "../utils/apiCalls";
import { useLogout } from "../utils/hooks/useLogout";
import { getErrorMessage } from "../utils/getErrorMessage";

function ChangePassword() {
  const navigate = useNavigate();
  const authStatus = useAuthStatus();

  useEffect(() => {
    console.log(authStatus.current);
    if (!authStatus.current) {
      navigate("/login");
    }
  }, [authStatus, navigate]);

  const [validated, setValidated] = useState(false);
  const [oldpassword, setOldpassword] = useState("");
  const [newpassword, setNewpassword] = useState("");
  const [renterpassword, setRenterpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const passwordMatched = useRef(true);
  const oldNotNewPassword = useRef(true);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const logout = useLogout();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
      if (passwordMatched.current && oldNotNewPassword.current) {
        setErrorMessage("");
        changeUserPassword();
      }
    }

    setValidated(true);
  };

  const checkPasswordMatch = (e) => {
    if (e.target.value === newpassword) {
      passwordMatched.current = true;
    } else {
      passwordMatched.current = false;
    }
    setRenterpassword(e.target.value);
  };
  const checkOldNotNewPassword = (e) => {
    if (e.target.value === oldpassword) {
      oldNotNewPassword.current = false;
    } else {
      oldNotNewPassword.current = true;
    }
    setRenterpassword("");
    setNewpassword(e.target.value);
  };

  const changeUserPassword = async () => {
    if (authStatus.current) {
      const passwordData = {
        old_password: oldpassword,
        new_password: newpassword,
      };
      const response = await changePassword(passwordData);
      if (response.status) {
        handleShow(); // shows the logout modal
      } else {
        const error = response?.message?.response?.data?.error_code;
        if (error) {
          setErrorMessage(getErrorMessage(error));
        }
      }
    } else {
      console.log("timeout")
      navigate("/login");
    }
  };
  return (
    <Container className="mt-3">
      <Row>
        <Col>
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
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\+\-\{\}\[\]:;<>,\.\?~\\\/]).{8,20}$"
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
        <Col>
          <Card className="p-5 m-5">
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Password change successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>You will be logged out</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={logout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
export default ChangePassword;
