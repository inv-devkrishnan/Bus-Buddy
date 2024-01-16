import React, { useContext } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RegisterUser from "../pages/RegisterUser";
import { Container } from "react-bootstrap";

jest.mock("../assets/register.jpg");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));
jest.mock("react-bootstrap", () => ({
  ...jest.requireActual("react-bootstrap"),
  Container: jest.fn(),
}));

describe("RegisterUser component", () => {
  useContext.mockImplementation(() => jest.fn());
  Container.mockImplementation(() => jest.fn());

  it("renders component", () => {
    render(<RegisterUser />);
  });
});
