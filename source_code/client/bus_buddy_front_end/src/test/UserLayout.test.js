import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserLayout from "../components/User/UserLayout";
import { SeatContextProvider } from "../utils/SeatContext";

jest.mock("../assets/driver.png");

describe("UserLayer component", () => {
  it("renders card", () => {
    render(
      <SeatContextProvider>
        <UserLayout trip={1} startLocation={2} endLocation={3} />
      </SeatContextProvider>
    );
  });
});
