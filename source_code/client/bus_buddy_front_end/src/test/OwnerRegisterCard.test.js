import React from "react";
import { BrowserRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { SeatContextProvider } from "../utils/SeatContext.jsx";
import { AddSeatContextProvider } from "../utils/AddSeatContext.jsx";
import { UserContextProvider } from "../components/User/UserContext.jsx";
import OwnerRegisterCard from "../components/OwnerRegisterCard.jsx";
import { openAxiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("OwnerRegisterCard component", () => {
  const data = {
    first_name: "firstName",
    last_name: "lastName",
    email: "email@gmail.com",
    password: "Aa@12345",
    phone: "9876543210",
    company_name: "Company",
    aadhaar_no: 123456789012,
    msme_no: "UDYAN-123-1234",
    extra_charges: 10,
  };

  it("renders component", () => {
    mock.onPost("bus-owner/registration/", data).reply(201);

    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <OwnerRegisterCard />
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

  it("renders component form submit and email verification", async () => {
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <OwnerRegisterCard />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.blur(firstNameTextbox);
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.blur(lastNameTextbox);
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.blur(emailTextbox);
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const passwordTextbox = screen.getByPlaceholderText("Enter password");
    fireEvent.blur(passwordTextbox);
    fireEvent.change(passwordTextbox, { target: { value: "Qwerty@123" } });

    const confirmTextbox = screen.getByPlaceholderText("Confirm password");
    fireEvent.blur(confirmTextbox);
    fireEvent.change(confirmTextbox, { target: { value: "Qwerty@123" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.blur(phoneTextbox);
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const companyTextbox = screen.getByPlaceholderText(
      "Enter the company name"
    );
    fireEvent.blur(companyTextbox);
    fireEvent.change(companyTextbox, { target: { value: "Company" } });

    const aadhaarTextbox = screen.getByPlaceholderText("Aadhaar number");
    fireEvent.blur(aadhaarTextbox);
    fireEvent.change(aadhaarTextbox, { target: { value: 123456789123 } });

    const msmeTextbox = screen.getByPlaceholderText("MSME number");
    fireEvent.blur(msmeTextbox);
    fireEvent.change(msmeTextbox, { target: { value: "UDYAM-AB-12-1234567" } });

    const gstTextbox = screen.getByPlaceholderText(
      "GST charges by the company"
    );
    fireEvent.blur(gstTextbox);
    fireEvent.change(gstTextbox, { target: { value: 18 } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPost(`bus-owner/registration/`).reply(201);
    });
  });
});
