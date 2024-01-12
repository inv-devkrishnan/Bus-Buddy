import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserLayer from "../components/User/UserLayer";
import { SeatContextProvider } from "../utils/SeatContext";

jest.mock("../components/User/UserSleeper.jsx")

describe("UserLayer component", () => {
  it("renders card", () => {
    render(
      <SeatContextProvider>
        <UserLayer row={1} />
      </SeatContextProvider>
    );
  });
});
