import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SeatDetailCard from "../components/User/SeatDetailCard";
import { Card } from "@mui/material";
import { Modal } from "react-bootstrap";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn().mockReturnValue({
    seatList: [
      {
        booked: [],
        bus: 1,
        deck: 0,
        female_only: false,
        id: 6,
        male_only: false,
        seat_cost: "250.000",
        seat_number: "a10",
        seat_type: 1,
        seat_ui_order: 41,
        Prototype: "Object",
      },
      {
        booked: [],
        bus: 1,
        deck: 0,
        female_only: false,
        id: 7,
        male_only: false,
        seat_cost: "250.000",
        seat_number: "a13",
        seat_type: 1,
        seat_ui_order: 51,
      },
    ],
  }),
}));
jest.mock("../assets/sleeper.png");
jest.mock("../assets/femaleSleeper.png");
jest.mock("../assets/maleSeater.png");
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Card: jest.fn(),
}));
jest.mock("react-bootstrap", () => ({
  ...jest.requireActual("react-bootstrap"),
  Modal: jest.fn(),
}));

describe("SeatDetailCard component", () => {

  it("renders component", () => {
    useNavigate.mockImplementation(() => jest.fn());
    Card.mockImplementation(() => jest.fn());
    Modal.mockImplementation(() => jest.fn());

    render(
      <SeatDetailCard
        selectionModelPick={[1]}
        selectionModelDrop={[2]}
        selectedPickStop={"pickup"}
        selectedDropStop={"dropoff"}
        routeCost={1000}
        gst={18}
      />
    );
  });
});
