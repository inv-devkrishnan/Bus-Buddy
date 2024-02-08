import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
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
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <UpdateForm />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    const clearButton = screen.getByText("Cancel");
    fireEvent.click(clearButton);
  });

  it("form submit get data error", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
    };
    mock.onGet("user/update-profile").reply(400, data);

    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <UpdateForm />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });

  it("form submit get data put error", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
    };
    mock.onGet("user/update-profile").reply(200, data);

    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <UpdateForm />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, {
      target: { value: "valid_email@gfmail.com" },
    });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    mock.onPut("user/update-profile", data).reply(400);
  });

  it("form submit get data put success", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
    };
    mock.onGet("user/update-profile").reply(200, data);

    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <UpdateForm />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000)); // to load locations

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, {
      target: { value: "valid_email@gfmail.com" },
    });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPut("user/update-profile").reply(200);
    });
  });
  it("form submit get data put success reply", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
    };
    mock.onGet("user/update-profile").reply(200, data);

    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <UpdateForm />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000)); // to load locations

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, {
      target: { value: "valid_email@gfmail.com" },
    });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPut("user/update-profile").reply(200);
    });
  });
  it("form submit get data email verification", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
    };
    mock.onGet("user/update-profile").reply(200, data);

    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <UpdateForm />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
  });
});
