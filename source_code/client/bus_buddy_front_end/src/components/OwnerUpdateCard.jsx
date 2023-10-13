import Swal from 'sweetalert2'
import { React } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from 'react-bootstrap/Card';
import updateImage from "../assets/update.jpg";
import axios from "axios";

export default function OwnerUpdateForm() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    axios
      .put("http://127.0.0.1:8000/bus-owner/update-profile/23", {
        first_name: data.get("firstName"),
        last_name: data.get("lastName"),
        email: data.get("email"),
        phone: data.get("phone"),
        company_name: data.get("companyName")
      })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire(
            'Edited!',
            'Updated successfully!',
            'success'
          )        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClear = () => {
    const form = document.getElementById("userRegisterForm");
    form.reset();
  };

  return (
    <>
    <Card style={{ width: '50rem' }}>
      <Card.Img variant="top" src={updateImage} />
      <Card.Body>
      <Form onSubmit={handleSubmit} id="userRegisterForm">
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label>Fisrt name</Form.Label>
          <Form.Control
            name="firstName"
            type="text"
            placeholder="Enter first name"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label>Last name</Form.Label>
          <Form.Control
            name="lastName"
            type="text"
            placeholder="Enter last name"
          />{" "}
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            type="email"
            placeholder="Enter email"
          />
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
          <Form.Label>Company name</Form.Label>
          <Form.Control
            name="companyName"
            type="text"
            placeholder="Enter email"
          />
        </Form.Group>
        <Button variant="primary" type="submit" style={{ margin: "4px" }}>
          Submit
        </Button>
        <Button
          variant="secondary"
          style={{ margin: "4px" }}
          onClick={handleClear}
        >
          Clear
        </Button>
      </Form>
      </Card.Body>
    </Card>
    </>
  );
}