import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserSleeper from "../components/User/UserSleeper";
import { SeatContextProvider } from "../utils/SeatContext";

jest.mock("../assets/sleeper.png");
jest.mock("../assets/selectedSleeper.png");
jest.mock("../assets/femaleSleeper.png");
jest.mock("../assets/maleSleeper.png");

describe("UserSleeper component", () => {
  it("renders card", () => {
    render(
      <SeatContextProvider>
        <UserSleeper nearFemale={false} nearMale={false} row={1} column={1} />
      </SeatContextProvider>
    );

    const sleeperButton = screen.getByTestId("selected sleeper button");
    fireEvent.click(sleeperButton)
  });
});
