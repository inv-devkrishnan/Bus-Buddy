import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
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

  test("delete Account Button Click", () => {
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
  })
});
