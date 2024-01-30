import React from "react";
import { render, fireEvent, screen,waitFor } from "@testing-library/react";
import ChangePassword from "../pages/ChangePassword";
import { BrowserRouter } from "react-router-dom";
import { changePassword } from "../utils/apiCalls";
jest.mock("../utils/apiCalls");
describe("Change Password", () => {
  test("change password render", () => {
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );
  });

  test("change password blank entry",async()=>{
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );
     // Submit the form
     fireEvent.click(screen.getByText("Change Password"));
     await waitFor(() => {
      expect(screen.getAllByText('* required field')[0]).toBeInTheDocument();
  });
  })

  test("change password click", () => {
    changePassword.mockResolvedValueOnce({
      status: true,
      message: {},
    });
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText("Old Password"), {
      target: { value: "Devk@207#" },
    });
    fireEvent.blur(screen.getByPlaceholderText("Old Password"))

    // Fill in the new password field
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "Devk@308#" },
    });
    fireEvent.blur(screen.getByPlaceholderText("New Password"))

    // Fill in the re-enter password field
    fireEvent.change(screen.getByPlaceholderText("Re enter Password"), {
      target: { value: "Devk@308#" },
    });

    fireEvent.blur(screen.getByPlaceholderText("Re enter Password"))
    
    fireEvent.click(screen.getByTestId("set-show-oldpassword"));
    fireEvent.click(screen.getByTestId("set-show-oldpassword"));

    fireEvent.click(screen.getByTestId("set-show-newpassword"));
    fireEvent.click(screen.getByTestId("set-show-newpassword"));

    fireEvent.click(screen.getByTestId("set-show-repassword"));
    fireEvent.click(screen.getByTestId("set-show-repassword"));
    // Submit the form
    fireEvent.click(screen.getByText("Change Password"));
  });

  test("change password failed", () => {
    changePassword.mockResolvedValueOnce({
      status: false,
      message: {
        response: {
          data: {
            error_code: "123",
          },
        },
      },
    });
    render(
      <BrowserRouter>
        <ChangePassword />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByPlaceholderText("Old Password"), {
      target: { value: "Devk@207#" },
    });

    // Fill in the new password field
    fireEvent.change(screen.getByPlaceholderText("New Password"), {
      target: { value: "Devk@308#" },
    });

    // Fill in the re-enter password field
    fireEvent.change(screen.getByPlaceholderText("Re enter Password"), {
      target: { value: "Devk@308#" },
    });

    // Submit the form
    fireEvent.click(screen.getByText("Change Password"));
  });
});
