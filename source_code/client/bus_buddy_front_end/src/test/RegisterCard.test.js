import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RegisterCard from "../components/User/RegisterCard";
import { BrowserRouter } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import { openAxiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("RegisterCard component", () => {
  const data = {
    first_name: "firstName",
    last_name: "lastName",
    email: "email@gmail.com",
    password: "Aa@12345",
    phone: "9876543210",
  };

  it("renders component", () => {
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <RegisterCard />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    const showPasswordButton = screen.getByTestId("show-password");
    fireEvent.click(showPasswordButton);

    const confirmPasswordButton = screen.getByTestId("confirm-show-password");
    fireEvent.click(confirmPasswordButton);

    const showButton = screen.getByTestId("show-password");
    fireEvent.click(showButton);

    const confirmButton = screen.getByTestId("confirm-show-password");
    fireEvent.click(confirmButton);

    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);
  });

  it("renders component form submit", async () => {
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <RegisterCard />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const passwordTextbox = screen.getByPlaceholderText("Enter password");
    fireEvent.change(passwordTextbox, { target: { value: "Qwerty@123" } });

    const confirmTextbox = screen.getByPlaceholderText("Confirm password");
    fireEvent.change(confirmTextbox, { target: { value: "Qwerty@123" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPost(`user/registration/`).reply(201);
    });
  });

  it("renders component form submit 2", async () => {
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <RegisterCard />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const passwordTextbox = screen.getByPlaceholderText("Enter password");
    fireEvent.change(passwordTextbox, { target: { value: "Qwerty@123" } });

    const confirmTextbox = screen.getByPlaceholderText("Confirm password");
    fireEvent.change(confirmTextbox, { target: { value: "Qwerty@123" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPost(`user/registration/`).reply(204);
    });
  });
  it("renders component form submit catch error", () => {
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <RegisterCard />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const passwordTextbox = screen.getByPlaceholderText("Enter password");
    fireEvent.change(passwordTextbox, { target: { value: "Qwerty@123" } });

    const confirmTextbox = screen.getByPlaceholderText("Confirm password");
    fireEvent.change(confirmTextbox, { target: { value: "Qwerty@123" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    mock.onPost("user/registration/", data).reply(400);
  });
  it("renders component form submit catch error 2", async () => {
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <RegisterCard />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const passwordTextbox = screen.getByPlaceholderText("Enter password");
    fireEvent.change(passwordTextbox, { target: { value: "Qwerty@123" } });

    const confirmTextbox = screen.getByPlaceholderText("Confirm password");
    fireEvent.change(confirmTextbox, { target: { value: "Qwerty@123" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
    const response = { email: "email error", phone: "error" };
    await waitFor(() => {
      mock.onPost("user/registration/", data).reply(400, response);
    });
  });
});
