import React from "react";
import { render} from "@testing-library/react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import PaymentPage from "../pages/PaymentPage";
import { useAuthStatus } from "../utils/hooks/useAuth";
jest.mock("../utils/hooks/useAuth", () => ({
  ...jest.requireActual("../utils/hooks/useAuth"),
  useAuthStatus: jest.fn().mockReturnValue(true),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn().mockReturnValue({
    state: {
      clientSecret: "fdsfsfdsfds",
      data: {
        total_amount: "4000",
      },
    },
  }),
}));
jest.mock("@stripe/stripe-js")
jest.mock("@stripe/react-stripe-js")

describe("payment page", () => {
  test("payment page render", () => {
    localStorage.setItem("user_role", "2");
    localStorage.setItem("user_name", "dev");
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <PaymentPage />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });

  test("payment page admin wise", () => {
    localStorage.setItem("user_role", "1");
    localStorage.setItem("user_name", "dev");
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <PaymentPage />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });

  test("payment page state null", () => {
    localStorage.setItem("user_role", "1");
    localStorage.setItem("user_name", "dev");
    
    useLocation.mockImplementation(
        jest.fn().mockReturnValue({
          state:null,
        })
      );
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <PaymentPage />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });

  test("payment page state else condition", () => {
    localStorage.setItem("user_role", "3");
    localStorage.setItem("user_name", "dev");
    useAuthStatus.mockImplementation(
        jest.fn().mockReturnValue(false)
      );
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <PaymentPage />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });
});
