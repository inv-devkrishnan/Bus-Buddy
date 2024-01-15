import React from "react";
import { render, fireEvent, screen,waitFor } from "@testing-library/react";
import DeleteAccount from "../pages/DeleteAccount";
import { BrowserRouter } from "react-router-dom";
import { deleteUserAccount } from "../utils/apiCalls";
jest.mock('../utils/apiCalls');
describe("Delete Account", () => {
  test("delete Account Render", () => {
    render(
      <BrowserRouter>
        <DeleteAccount />
      </BrowserRouter>
    );
  });

  test("delete Account Button Click", async() => {
    deleteUserAccount.mockResolvedValueOnce({
      status: true,
      message: {},
    });
    render(
      <BrowserRouter>
        <DeleteAccount />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("delete-btn-prompt"));
    await waitFor(() => {
      expect(screen.getByText('Now you will be redirected to login page')).toBeInTheDocument();
  });
  fireEvent.click(screen.getByText("OK"));
  })
  test("delete Account Button Click fail", async() => {
    deleteUserAccount.mockResolvedValueOnce({
      status: false,
      message: "def",
    });
    render(
      <BrowserRouter>
        <DeleteAccount />
      </BrowserRouter>
      
    );
    fireEvent.click(screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("delete-btn-prompt"));
  })
});
