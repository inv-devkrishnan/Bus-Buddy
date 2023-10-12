import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

import { useAuthStatus } from "../utils/useAuth";

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
  const passwordMatched = useRef(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
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
  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <h1>Change Password</h1>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="ms-3 mt-3"
          >
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label> Old Password</Form.Label>
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
                Please provide a valid Password.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*\(\)_\+\-\{\}\[\]:;<>,\.\?~\\\/]).{8,20}$"
                placeholder="New Password"
                value={newpassword}
                onChange={(e) => {
                  setNewpassword(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Password.
              </Form.Control.Feedback>
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Re enter Password</Form.Label>
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
            <Button variant="success" type="submit">
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
    </Container>
  );
}
export default ChangePassword;
