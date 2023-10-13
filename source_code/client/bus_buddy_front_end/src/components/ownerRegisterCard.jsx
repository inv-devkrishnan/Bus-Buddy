import { React, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import registerImage from "../assets/register.jpg";
import axios from 'axios';

export default function OwnerRegisterCard() {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
axios.post('http://127.0.0.1:8000/bus-owner/registration/',{
    first_name: data.get("firstName"),
    last_name : data.get("lastName"),
    email: data.get("email"),
    password: data.get("password"),
    phone: data.get("phone"),
    company_name: data.get("companyName"),
    aadhaar_no: data.get("aadhaar"),
    msme_no: data.get("msme"),
    extra_charges: data.get("extraCharges")
}).then((res)=>{
    if(res.status === 201){alert("registered successfully")}
}).catch((err)=>{console.log(err.response);})
  };

  const handleClear = (event)=>{
  const form = document.getElementById('ownerRegisterForm');
  form.reset();
  }

  return (
    <>
      <Card style={{ width: "55rem" }}>
        <Container>
          <Row>
            <Col>
              <Card.Img
                style={{ alignContent: "flex-start" }}
                src={registerImage}
                alt="register"
              />
            </Col>
            <Col>
              <Card.Body>
                <Form onSubmit={handleSubmit} id="ownerRegisterForm" > 
                  <Row>
                    <Col>
                      <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>Fisrt name</Form.Label>
                        <Form.Control
                          name="firstName"
                          type="text"
                          placeholder="Enter first name"
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                          name="lastName"
                          type="text"
                          placeholder="Enter last name"
                        />{" "}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      name="email"
                      type="temailext"
                      placeholder="Enter email"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleClickShowPassword}
                      >
                        show
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Label>Confirm password</Form.Label>
                    <InputGroup className="mb-3">
                      <Form.Control
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm password"
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={handleClickShowConfirmPassword}
                        aria-label="Mute"
                      >
                        show
                      </Button>
                    </InputGroup>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="phone">
                    <Form.Label>Phone number</Form.Label>
                    <Form.Control
                      name="phone"
                      type="text"
                      maxLength={10}
                      placeholder="Phone number"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="companyName">
                    <Form.Label>Comapny name</Form.Label>
                    <Form.Control
                      name="companyName"
                      type="text"
                      placeholder="Enter the company name"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="aadhaar">
                    <Form.Label>Aadhaar number</Form.Label>
                    <Form.Control
                      name="aadhaar"
                      type="text"
                      placeholder="Adhaar number"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="msme">
                    <Form.Label>MSME number</Form.Label>
                    <Form.Control
                      name="msme"
                      type="text"
                      placeholder="MSME number"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="extraCharges">
                    <Form.Label>Charge by the company</Form.Label>
                    <Form.Control
                      name="extraCharges"
                      type="number"
                      placeholder="Extra charges"
                    />
                  </Form.Group>
                  <Row>
                    <Col>
                      <Button
                        variant="primary"
                        type="submit"
                        style={{ margin: "4px" }}
                      >
                        Submit
                      </Button>
                      <Button variant="secondary" style={{ margin: "4px" }} onClick={handleClear}>
                        Clear
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Col>
          </Row>
        </Container>
      </Card>
    </>
  );
}
