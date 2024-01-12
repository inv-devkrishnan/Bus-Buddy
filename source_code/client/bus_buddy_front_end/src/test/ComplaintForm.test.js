import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ComplaintForm from "../components/User/ComplaintForm";

describe("ComplaintForm component", () => {
  it("renders component", () => {
    render(<ComplaintForm />);
  });
});
