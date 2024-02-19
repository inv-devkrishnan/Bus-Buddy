import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import DeleteAccount from "../pages/DeleteAccount";
import { BrowserRouter } from "react-router-dom";
import { deleteUserAccount } from "../utils/apiCalls";
import { UserContextProvider } from "../components/User/UserContext";
jest.mock("../utils/apiCalls");
describe("Delete Account", () => {
  test("delete Account Render", () => {
    render(
      <UserContextProvider>
        <BrowserRouter>
          <DeleteAccount />
        </BrowserRouter>
      </UserContextProvider>
    );
  });

  test("delete Account Button Click", async () => {
    deleteUserAccount.mockResolvedValueOnce({
      status: true,
      message: {},
    });
    render(
      <UserContextProvider>
        <BrowserRouter>
          <DeleteAccount />
        </BrowserRouter>
      </UserContextProvider>
    );
    fireEvent.click(screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("delete-btn-prompt"));
    await waitFor(() => {
      expect(
        screen.getByText("Now you will be redirected to login page")
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("OK"));
  });
  test("delete Account Button Click fail", async () => {
    deleteUserAccount.mockResolvedValueOnce({
      status: false,
      message: { response: { data: { error_code: "D1035" } } },
    });
    render(
      <UserContextProvider>
        <BrowserRouter>
          <DeleteAccount />
        </BrowserRouter>
      </UserContextProvider>
    );
    fireEvent.click(screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("delete-btn-prompt"));
  });

  test("delete Account Button Click fail else", async () => {
    deleteUserAccount.mockResolvedValueOnce({
      status: false,
      message: { data: { error_code: "D1036" } },
    });
    render(
      <UserContextProvider>
        <BrowserRouter>
          <DeleteAccount />
        </BrowserRouter>
      </UserContextProvider>
    );
    fireEvent.click(screen.getByTestId("delete-btn"));
    fireEvent.click(screen.getByTestId("delete-btn-prompt"));
  });
});
