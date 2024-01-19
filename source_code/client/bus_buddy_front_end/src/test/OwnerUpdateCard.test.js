import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import OwnerUpdateForm from "../components/OwnerUpdateCard";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("OwnerUpdateCard component", () => {
  it("renders card", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
      company_name: "valid_company_name",
      aadhaar_no: 123456789123,
      msme_no: "valid_msme",
      extra_charges: 18,
    };
    mock.onGet("bus-owner/update-profile").reply(200, data);

    render(<OwnerUpdateForm />);

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const companyTextbox = screen.getByPlaceholderText(
      "Enter the company name"
    );
    fireEvent.change(companyTextbox, { target: { value: "Company" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPut("bus-owner/update-profile").reply(200);
    });
  });
  it("form submit", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
      company_name: "valid_company_name",
      aadhaar_no: 123456789123,
      msme_no: "valid_msme",
      extra_charges: 18,
    };
    mock.onGet("bus-owner/update-profile").reply(200, data);

    render(<OwnerUpdateForm />);

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const companyTextbox = screen.getByPlaceholderText(
      "Enter the company name"
    );
    fireEvent.change(companyTextbox, { target: { value: "Company" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      mock.onPut("bus-owner/update-profile").reply(204);
    });
  });
  it("renders card catch error", () => {
    mock.onGet("bus-owner/update-profile").reply(400);

    render(<OwnerUpdateForm />);
    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);
  });

  it("form submit error", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
      company_name: "valid_company_name",
      aadhaar_no: 123456789123,
      msme_no: "valid_msme",
      extra_charges: 18,
    };
    mock.onGet("bus-owner/update-profile").reply(200, data);

    render(<OwnerUpdateForm />);

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const companyTextbox = screen.getByPlaceholderText(
      "Enter the company name"
    );
    fireEvent.change(companyTextbox, { target: { value: "Company" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
    const response = { email: "email error" };
    await waitFor(() => {
      mock.onPut("bus-owner/update-profile").reply(400, response);
    });
  });

  it("form submit error 2", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
      company_name: "valid_company_name",
      aadhaar_no: 123456789123,
      msme_no: "valid_msme",
      extra_charges: 18,
    };
    mock.onGet("bus-owner/update-profile").reply(200, data);

    render(<OwnerUpdateForm />);

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const companyTextbox = screen.getByPlaceholderText(
      "Enter the company name"
    );
    fireEvent.change(companyTextbox, { target: { value: "Company" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
    const response = { email: "email error", phone: "phone error" };
    await waitFor(() => {
      mock.onPut("bus-owner/update-profile").reply(400, response);
    });
  });

  it("form submit error 3", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
      company_name: "valid_company_name",
      aadhaar_no: 123456789123,
      msme_no: "valid_msme",
      extra_charges: 18,
    };
    mock.onGet("bus-owner/update-profile").reply(200, data);

    render(<OwnerUpdateForm />);

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const companyTextbox = screen.getByPlaceholderText(
      "Enter the company name"
    );
    fireEvent.change(companyTextbox, { target: { value: "Company" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
    const response = { phone: "phone error" };
    await waitFor(() => {
      mock.onPut("bus-owner/update-profile").reply(400, response);
    });
  });

  it("form submit error 4", async () => {
    const data = {
      first_name: "valid_first_name",
      last_name: "valid_last_name",
      email: "valid_email@gfmail.com",
      phone: 1234567890,
      company_name: "valid_company_name",
      aadhaar_no: 123456789123,
      msme_no: "valid_msme",
      extra_charges: 18,
    };
    mock.onGet("bus-owner/update-profile").reply(200, data);

    render(<OwnerUpdateForm />);

    const firstNameTextbox = screen.getByPlaceholderText("Enter first name");
    fireEvent.change(firstNameTextbox, { target: { value: "first" } });

    const lastNameTextbox = screen.getByPlaceholderText("Enter last name");
    fireEvent.change(lastNameTextbox, { target: { value: "second" } });

    const emailTextbox = screen.getByPlaceholderText("Enter email");
    fireEvent.change(emailTextbox, { target: { value: "email@gmail.com" } });

    const phoneTextbox = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneTextbox, { target: { value: "9512478630" } });

    const companyTextbox = screen.getByPlaceholderText(
      "Enter the company name"
    );
    fireEvent.change(companyTextbox, { target: { value: "Company" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
    await waitFor(() => {
      mock.onPut("bus-owner/update-profile").reply(400);
    });
  });
});
