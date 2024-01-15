import React, { useContext } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RegisterOwner from "../pages/RegisterOwner";
import { Image } from "react-bootstrap";

jest.mock("../assets/register.jpg");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));
jest.mock("react-bootstrap", () => ({
  ...jest.requireActual("react-bootstrap"),
  Image: jest.fn(),
}));

describe("RegisterOwner component", () => {
  useContext.mockImplementation(() => jest.fn());
  Image.mockImplementation(() => jest.fn());

  it("renders component", () => {
    render(<RegisterOwner />);
  });
});
