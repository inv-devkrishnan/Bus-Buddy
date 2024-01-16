import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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
  it("renders card", () => {
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

    const submitButton = screen.getByText("Submit")
    fireEvent.click(submitButton)
  });

  it("renders card catch error", () => {
    mock.onGet("bus-owner/update-profile").reply(400);

    render(<OwnerUpdateForm />);
    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);
  });
});
