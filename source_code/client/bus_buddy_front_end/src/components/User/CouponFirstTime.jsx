import React from "react";
import { Card } from "react-bootstrap";
import "./CouponFirstTime.css";

export default function CouponFirstTime() {
  return (
    <div>
      <Card className="card-image" style={{ width: "19rem" }}>
        <Card.Title className="m-3" style={{ color: "white" }}>
          Title
        </Card.Title>
        <Card.Body>
          <Card.Text style={{ color: "white" }} className="m-2">
            Details
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
