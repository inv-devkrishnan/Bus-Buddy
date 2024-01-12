import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ComplaintResponse from "../components/User/ComplaintResponse";

describe("ComplaintResponse component", () => {
  it("renders component", () => {
    render(<ComplaintResponse />);
  });
});
