import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FullSleeperLayout from "../components/BusOwner/SeatComponents/Layouts/FullSleeperLayout";
import { AddSeatContextProvider } from "../utils/AddSeatContext";

jest.mock("../assets/driver.png");

describe("FullSleeperLayout component", () => {
  it("renders card", () => {
    render(
      <AddSeatContextProvider>
        <FullSleeperLayout bus={1} />
      </AddSeatContextProvider>
    );
  });
});
