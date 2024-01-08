import React from "react";
import { Image } from "react-bootstrap";
import RegisterImage from "../assets/register.jpg";
import RegisterCard from "../components/User/RegisterCard";

export default function RegisterUser() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Image
        src={RegisterImage}
        alt="register user"
        fluid
        style={{ width: "50%", height: "auto" }}
      />
      <RegisterCard />
    </div>
  );
}
