import React from "react";
import { Image } from "react-bootstrap";
import RegisterImage from "../assets/register.jpg";
import RegisterCard from "../components/RegisterCard";

export default function RegisterUser() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
