import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Sleeper from "../components/BusOwner/SeatComponents/Sleeper";
import { AddSeatContextProvider } from "../utils/AddSeatContext";

jest.mock("../assets/sleeper.png");
jest.mock("../assets/selectedSleeper.png");
jest.mock("../assets/maleSleeper.png");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  AddSeatContext: jest.fn().mockReturnValue({
    updateIsClicked: jest.fn(),
    propsData: 11,
    updatePropsData: jest.fn(),
    currentData: [
      {
        bus: 1,
        seat_ui_order: 11,
        seat_number: "1",
        seat_type: 0,
        deck: 0,
        seat_cost: 200,
      },
    ],
  }),
}));

describe("SeatDescription component", () => {
  it("renders card", () => {
    render(
      <AddSeatContextProvider>
        <Sleeper column={1} row={1} />
      </AddSeatContextProvider>
    );
  });
  it("renders card has selected", () => {
    render(
      <AddSeatContextProvider>
        <Sleeper column={2} row={3} />
      </AddSeatContextProvider>
    );

    const seaterButton = screen.getByTestId("selected_sleeper");
    fireEvent.click(seaterButton);
  });
});
