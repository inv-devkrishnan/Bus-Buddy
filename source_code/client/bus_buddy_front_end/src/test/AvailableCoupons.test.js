import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AvailableCoupons from "../components/User/AvailableCoupons";
import { UserContextProvider } from "../components/User/UserContext";

jest.mock("../components/User/UserSleeper.jsx");

describe("AvailableCoupons component", () => {
  it("renders card", () => {
    render(
      <UserContextProvider>
        <AvailableCoupons totalAmount={1000} setTotalAmount={jest.fn()} />
      </UserContextProvider>
    );
  });
});
