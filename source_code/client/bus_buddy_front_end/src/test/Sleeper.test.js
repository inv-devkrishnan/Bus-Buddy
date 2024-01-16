import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Sleeper from "../components/BusOwner/SeatComponents/Sleeper";
import { AddSeatContextProvider } from "../utils/AddSeatContext";

jest.mock("../assets/sleeper.png");
jest.mock("../assets/selectedSleeper.png");
jest.mock("../assets/maleSleeper.png");

describe("SeatDescription component", () => {
  it("renders card", () => {
    render(
      <AddSeatContextProvider>
        <Sleeper column={1} row={1} />
      </AddSeatContextProvider>
    );
  });
});
