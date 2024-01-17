import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FormComponent from "../components/BusOwner/SeatComponents/FormComponent";

jest.mock("@mui/material/Card");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn().mockReturnValue({
    propsData: 11,
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
    currentSeatData: [
      {
        bus: 1,
        seat_ui_order: 11,
        seat_number: "1",
        seat_type: 0,
        deck: 0,
        seat_cost: 200,
      },
    ],
    updateCurrentSeatData: jest.fn(),
    reRender: false,
    updateReRender: jest.fn(),
  }),
}));
describe("FormComponent component", () => {
  it("renders card", () => {
    render(<FormComponent bus={1} />);
  });
});

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn().mockReturnValue({
    propsData: 12,
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
    currentSeatData: [
      {
        bus: 1,
        seat_ui_order: 11,
        seat_number: "1",
        seat_type: 0,
        deck: 0,
        seat_cost: 200,
      },
    ],
    updateCurrentSeatData: jest.fn(),
    reRender: false,
    updateReRender: jest.fn(),
  }),
}));

describe("FormComponent else", () => {
  it("renders card else", () => {
    render(<FormComponent bus={1} />);
  });
});
