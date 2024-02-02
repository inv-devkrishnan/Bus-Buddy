import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import EmailVerification from "../components/common/EmailVerification";
import { openAxiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("EmailVerification Component", () => {
  const mockProps = {
    values: {
      email: "test@example.com",
    },
    show: true,
    setShow: jest.fn(),
    afterFunction: jest.fn(),
    alertMessage: "Loading...",
  };

  it("renders the component correctly and post", async () => {
    render(<EmailVerification {...mockProps} />);
  });

  it("renders the component correctly and post error", () => {
    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);

    mock.onPost(`account/generate-otp/`).reply(400);
  });

  it("handles button click and API call 201 and verify 201", async () => {
    await waitFor(() => {
      mock.onPost(`account/generate-otp/`).reply(201, { message: "Success" });
    });

    await waitFor(() => {
      mock
        .onGet(`account/verify-email/?email=test@example.com&otp=${123456}`)
        .reply(201);
    });

    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpAgainButton = screen.getByText("Send OTP Again");
    fireEvent.click(otpAgainButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpInput = screen.getByLabelText("OTP :");
    fireEvent.change(otpInput, { target: { value: "123456" } });

    const verifyButton = screen.getByText("Verify");
    fireEvent.click(verifyButton);
  });

  it("handles button click and API call 201 and verify 200", async () => {
    await waitFor(() => {
      mock.onPost(`account/generate-otp/`).reply(201, { message: "Success" });
    });

    await waitFor(() => {
      mock
        .onGet(`account/verify-email/?email=test@example.com&otp=${123456}`)
        .reply(200);
    });

    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpAgainButton = screen.getByText("Send OTP Again");
    fireEvent.click(otpAgainButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpInput = screen.getByLabelText("OTP :");
    fireEvent.change(otpInput, { target: { value: "123456" } });

    const verifyButton = screen.getByText("Verify");
    fireEvent.click(verifyButton);
  });

  it("handles button click and API call 201 and verify 205", async () => {
    await waitFor(() => {
      mock.onPost(`account/generate-otp/`).reply(201, { message: "Success" });
    });

    await waitFor(() => {
      mock
        .onGet(`account/verify-email/?email=test@example.com&otp=${123456}`)
        .reply(205);
    });

    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpAgainButton = screen.getByText("Send OTP Again");
    fireEvent.click(otpAgainButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpInput = screen.getByLabelText("OTP :");
    fireEvent.change(otpInput, { target: { value: "123456" } });

    const verifyButton = screen.getByText("Verify");
    fireEvent.click(verifyButton);
  });

  it("handles button click and API call 201 and verify else", async () => {
    await waitFor(() => {
      mock.onPost(`account/generate-otp/`).reply(201, { message: "Success" });
    });

    await waitFor(() => {
      mock
        .onGet(`account/verify-email/?email=test@example.com&otp=${123456}`)
        .reply(225);
    });

    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpAgainButton = screen.getByText("Send OTP Again");
    fireEvent.click(otpAgainButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpInput = screen.getByLabelText("OTP :");
    fireEvent.change(otpInput, { target: { value: "123456" } });

    const verifyButton = screen.getByText("Verify");
    fireEvent.click(verifyButton);
  });

  it("handles button click and API call 201 and verify error", async () => {
    await waitFor(() => {
      mock.onPost(`account/generate-otp/`).reply(201, { message: "Success" });
    });

    await waitFor(() => {
      mock
        .onGet(`account/verify-email/?email=test@example.com&otp=${123456}`)
        .reply(400);
    });

    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpAgainButton = screen.getByText("Send OTP Again");
    fireEvent.click(otpAgainButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpInput = screen.getByLabelText("OTP :");
    fireEvent.change(otpInput, { target: { value: "123456" } });

    const verifyButton = screen.getByText("Verify");
    fireEvent.click(verifyButton);
  });

  it("handles button click and API call 200", async () => {
    await waitFor(() => {
      mock.onPost(`account/generate-otp/`).reply(200, { message: "Success" });
    });

    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);
  });

  it("handles button click and API call 204", async () => {
    await waitFor(() => {
      mock.onPost(`account/generate-otp/`).reply(204, { message: "Success" });
    });

    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);
  });

  it("handles button click and API call then else", async () => {
    await waitFor(() => {
      mock.onPost(`account/generate-otp/`).reply(205, { message: "Success" });
    });

    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);
  });

  it("handles button click and API call 201 verify error", async () => {
    await waitFor(() => {
      mock.onPost(`account/generate-otp/`).reply(201, { message: "Success" });
    });

    render(<EmailVerification {...mockProps} />);

    const otpButton = screen.getByText("Send OTP");
    fireEvent.click(otpButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpAgainButton = screen.getByText("Send OTP Again");
    fireEvent.click(otpAgainButton);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const otpInput = screen.getByLabelText("OTP :");
    fireEvent.change(otpInput, { target: { value: "123456" } });

    const verifyButton = screen.getByText("Verify");
    fireEvent.click(verifyButton);
  });
});
