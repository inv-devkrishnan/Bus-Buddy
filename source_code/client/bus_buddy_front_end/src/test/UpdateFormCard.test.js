import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UpdateForm from "../components/User/UpdateFormCard";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("RegisterUser component", () => {
  it("renders card", () => {
    render(<UpdateForm />);

    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);
  });

  it("form submit", async () => {
    render(<UpdateForm />);

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPut("user/update-profile").reply(200);
    });
  });

  it("form submit get data", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
    };
    mock.onGet("user/update-profile").reply(200, data);

    render(<UpdateForm />);

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPut("user/update-profile").reply(204);
    });
  });
});
