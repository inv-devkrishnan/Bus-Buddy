import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserSleeper from "../components/User/UserSleeper";
import { SeatContextProvider } from "../utils/SeatContext";

jest.mock("../assets/sleeper.png");
jest.mock("../assets/selectedSleeper.png");
jest.mock("../assets/femaleSleeper.png");
jest.mock("../assets/maleSleeper.png");

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  SeatContext: jest.fn().mockReturnValue({
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
    seatData: [
      [
        {
          id: 1,
          arrival_time: "10:00:00",
          bus_stop: "edapally",
        },
        {
          id: 2,
          arrival_time: "10:10:00",
          bus_stop: "Kochi",
        },
      ],
      [
        {
          id: 5,
          arrival_time: "14:20:00",
          bus_stop: "Trivandrum",
        },
      ],
      {
        bus: 1,
        deck: 0,
        id: 1,
        seat_cost: "250.000",
        seat_number: "a1",
        seat_type: 1,
        seat_ui_order: 11,
        booked: [],
      },
      {
        bus: 1,
        deck: 0,
        id: 2,
        seat_cost: "200.000",
        seat_number: "a2",
        seat_type: 1,
        seat_ui_order: 12,
        booked: [],
      },
      {
        bus: 1,
        deck: 0,
        id: 3,
        seat_cost: "225.000",
        seat_number: "a3",
        seat_type: 1,
        seat_ui_order: 13,
        booked: [
          {
            traveller_gender: 1,
            trip: 1,
          },
        ],
      },
      {
        bus: 1,
        deck: 0,
        id: 4,
        seat_cost: "250.000",
        seat_number: "a4",
        seat_type: 1,
        seat_ui_order: 21,
        booked: [
          {
            traveller_gender: 2,
            trip: 1,
          },
        ],
      },
    ],

    updateSeatList: jest.fn(),
  }),
}));

describe("UserSleeper component", () => {
  it("renders card", () => {
    render(
      <SeatContextProvider>
        <UserSleeper nearFemale={true} nearMale={false} row={1} column={1} />
      </SeatContextProvider>
    );

    const sleeperButton = screen.getByTestId("selected sleeper button");
    fireEvent.click(sleeperButton);
    fireEvent.mouseOver(sleeperButton);
    fireEvent.mouseOut(sleeperButton);
  });
  it("renders card anotehr", () => {
    localStorage.setItem(
      "seat_list",
      '[{"id":181,"seat_number":"a11","seat_type":0,"deck":0,"seat_cost":"100.000","bus":7,"seat_ui_order":11,"booked":[],"female_only":false,"male_only":false}]'
    );
    render(
      <SeatContextProvider>
        <UserSleeper nearFemale={false} nearMale={true} row={1} column={1} />
      </SeatContextProvider>
    );

    const sleeperButton = screen.getByTestId("selected sleeper button");
    fireEvent.click(sleeperButton);
  });
});
