import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserSleeper from "../components/User/UserSleeper";
import { SeatContextProvider } from "../utils/SeatContext";

jest.mock("../components/User/UserSleeper.jsx");

describe("UserSleeper component", () => {
  it("renders card", () => {
    render(
      <SeatContextProvider>
        <UserSleeper nearFemale={false} nearMale={false} row={1} column={1} />
      </SeatContextProvider>
    );
  });
});
