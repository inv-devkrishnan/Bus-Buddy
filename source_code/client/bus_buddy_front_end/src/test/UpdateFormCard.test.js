import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UpdateForm from "../components/User/UpdateFormCard";


describe("RegisterUser component", () => {

  it("renders card", () => {
    render(<UpdateForm />);
  });
});
