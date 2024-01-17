import React from "react";
import { Image } from "react-bootstrap";
import OwnerRegisterCard from "../components/OwnerRegisterCard";
import RegisterImage from "../assets/register.jpg";

export default function RegisterOwner() {
  return (
    <div className="d-flex justify-content-center align-items-center ">
      <Image
        src={RegisterImage}
        alt="register user"
        fluid
        style={{ width: "40%", height: "auto" }}
      />
      <OwnerRegisterCard />
    </div>
  );
}
