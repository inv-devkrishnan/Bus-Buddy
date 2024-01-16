import React from "react";
import { fireEvent, render,screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import CardPayment from "../components/User/payment/CardPayment";

jest.mock("@stripe/stripe-js")
jest.mock("@stripe/react-stripe-js")
describe("stripe card", () => {
  test("stripe card render", () => {
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <CardPayment data={{total_amount:"50"}} />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
     
    );
    fireEvent.click(screen.getByText("Pay ₹ 50"));
  });
});
