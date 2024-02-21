import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import RegisterImage from "../assets/register.jpg";
import RegisterCard from "../components/User/RegisterCard";

export default function RegisterUser() {
  return (
    <Container fluid>
      <Row className="align-items-center">
        <Col lg={6} md={4} sm={12}>
          <Image
            draggable={false}
            src={RegisterImage}
            alt="register user"
            width="80%"
            fluid
          />
        </Col>
        <Col lg={6} md={8} sm={12} className="p-0">
          <RegisterCard />
        </Col>
      </Row>
    </Container>
  );
}
