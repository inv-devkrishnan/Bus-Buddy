import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Seater from "../components/BusOwner/SeatComponents/Seater";

jest.mock("../assets/seater.png");
jest.mock("../assets/selectedSeater.png");
jest.mock("../assets/maleSeater.png");
jest.mock("@mui/material/IconButton");
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn().mockReturnValue({
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
describe("Seater component", () => {
  it("renders card", () => {
    render(<Seater column={1} row={2} />);
  });
  it("renders card has selected", () => {
    render(<Seater column={1} row={1} />);
  });
});
