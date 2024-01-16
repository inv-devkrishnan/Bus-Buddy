import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Seater from "../components/BusOwner/SeatComponents/Seater";
import { AddSeatContextProvider } from "../utils/AddSeatContext";

jest.mock("../assets/seater.png");
jest.mock("../assets/selectedSeater.png");
jest.mock("../assets/maleSeater.png");

describe("Seater component", () => {
  it("renders card", () => {
    render(
      <AddSeatContextProvider>
        <Seater column={1} row={1} />
      </AddSeatContextProvider>
    );
    const seaterButton = screen.getByTestId("selected_seater")
    fireEvent.click(seaterButton)
  });
});
