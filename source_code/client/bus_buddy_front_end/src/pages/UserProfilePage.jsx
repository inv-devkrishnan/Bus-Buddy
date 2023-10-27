import React from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card"
import CardText from "react-bootstrap/esm/CardText";

export default function UserProfilePage() {
  return (
    <div>
      {" "}
      <Container className="mt-3">
        <h1>My Profile</h1>
        <div className="ms-3 mt-3">
          <Card className="d-grid gap-3" style={{width:"100%",height:"auto"}}>
          <CardText >Your name:</CardText>
          <CardText>Contact Details</CardText>          
          <CardText>Phone number:</CardText>
          <CardText>Email:</CardText>
          </Card>
        </div>
      </Container>
    </div>
  );
}
