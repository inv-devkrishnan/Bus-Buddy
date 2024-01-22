import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserLayout from "../components/User/UserLayout";
import { SeatContextProvider } from "../utils/SeatContext";
import { openAxiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
});

afterEach(() => {
  mock.restore();
});

jest.mock("../assets/driver.png");
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  SeatContext: jest.fn().mockReturnValue({
    updateSeatList: jest.fn(),
  }),
}));
describe("UserLayout component", () => {
  it("renders card", () => {
    const data = [
      [
        {
          id: 1,
          bus_stop: "edapally",
          arrival_time: "10:00:00",
        },
        {
          id: 2,
          bus_stop: "Kochi",
          arrival_time: "10:10:00",
        },
      ],
      [
        {
          id: 5,
          bus_stop: "Trivandrum",
          arrival_time: "14:20:00",
        },
      ],
      {
        id: 1,
        seat_number: "a1",
        seat_type: 1,
        deck: 0,
        seat_cost: "250.000",
        bus: 1,
        seat_ui_order: 11,
        booked: [],
      },
      {
        id: 2,
        seat_number: "a2",
        seat_type: 1,
        deck: 0,
        seat_cost: "200.000",
        bus: 1,
        seat_ui_order: 12,
        booked: [],
      },
      {
        id: 3,
        seat_number: "a3",
        seat_type: 1,
        deck: 0,
        seat_cost: "225.000",
        bus: 1,
        seat_ui_order: 13,
        booked: [
          {
            traveller_gender: 1,
            trip: 1,
          },
        ],
      },
      {
        id: 4,
        seat_number: "a4",
        seat_type: 1,
        deck: 0,
        seat_cost: "250.000",
        bus: 1,
        seat_ui_order: 21,
        booked: [
          {
            traveller_gender: 2,
            trip: 1,
          },
        ],
      },
      {
        id: 5,
        seat_number: "a7",
        seat_type: 1,
        deck: 0,
        seat_cost: "250.000",
        bus: 1,
        seat_ui_order: 31,
        booked: [],
      },
      {
        id: 6,
        seat_number: "a10",
        seat_type: 1,
        deck: 0,
        seat_cost: "250.000",
        bus: 1,
        seat_ui_order: 41,
        booked: [],
      },
      {
        id: 7,
        seat_number: "a13",
        seat_type: 1,
        deck: 0,
        seat_cost: "250.000",
        bus: 1,
        seat_ui_order: 51,
        booked: [],
      },
      {
        id: 8,
        seat_number: "a4",
        seat_type: 1,
        deck: 0,
        seat_cost: "200.000",
        bus: 1,
        seat_ui_order: 22,
        booked: [],
      },
      {
        id: 9,
        seat_number: "a8",
        seat_type: 1,
        deck: 0,
        seat_cost: "200.000",
        bus: 1,
        seat_ui_order: 32,
        booked: [],
      },
      {
        id: 10,
        seat_number: "a11",
        seat_type: 1,
        deck: 0,
        seat_cost: "200.000",
        bus: 1,
        seat_ui_order: 42,
        booked: [],
      },
      {
        id: 11,
        seat_number: "a14",
        seat_type: 1,
        deck: 0,
        seat_cost: "200.000",
        bus: 1,
        seat_ui_order: 52,
        booked: [],
      },
      {
        id: 12,
        seat_number: "a6",
        seat_type: 1,
        deck: 0,
        seat_cost: "225.000",
        bus: 1,
        seat_ui_order: 23,
        booked: [
          {
            traveller_gender: 1,
            trip: 1,
          },
        ],
      },
      {
        id: 13,
        seat_number: "a9",
        seat_type: 1,
        deck: 0,
        seat_cost: "225.000",
        bus: 1,
        seat_ui_order: 33,
        booked: [
          {
            traveller_gender: 2,
            trip: 1,
          },
        ],
      },
      {
        id: 14,
        seat_number: "a12",
        seat_type: 1,
        deck: 0,
        seat_cost: "225.000",
        bus: 1,
        seat_ui_order: 43,
        booked: [],
      },
      {
        id: 15,
        seat_number: "a15",
        seat_type: 1,
        deck: 0,
        seat_cost: "225.000",
        bus: 1,
        seat_ui_order: 53,
        booked: [],
      },
      {
        id: 16,
        seat_number: "b1",
        seat_type: 1,
        deck: 0,
        seat_cost: "150.000",
        bus: 1,
        seat_ui_order: 61,
        booked: [],
      },
      {
        id: 17,
        seat_number: "b4",
        seat_type: 1,
        deck: 1,
        seat_cost: "150.000",
        bus: 1,
        seat_ui_order: 71,
        booked: [],
      },
      {
        id: 18,
        seat_number: "b7",
        seat_type: 1,
        deck: 1,
        seat_cost: "150.000",
        bus: 1,
        seat_ui_order: 81,
        booked: [],
      },
      {
        id: 19,
        seat_number: "b10",
        seat_type: 1,
        deck: 1,
        seat_cost: "150.000",
        bus: 1,
        seat_ui_order: 91,
        booked: [],
      },
      {
        id: 20,
        seat_number: "b13",
        seat_type: 1,
        deck: 1,
        seat_cost: "150.000",
        bus: 1,
        seat_ui_order: 101,
        booked: [],
      },
      {
        id: 21,
        seat_number: "b2",
        seat_type: 1,
        deck: 1,
        seat_cost: "100.000",
        bus: 1,
        seat_ui_order: 62,
        booked: [],
      },
      {
        id: 22,
        seat_number: "b3",
        seat_type: 1,
        deck: 1,
        seat_cost: "125.000",
        bus: 1,
        seat_ui_order: 63,
        booked: [],
      },
      {
        id: 23,
        seat_number: "b5",
        seat_type: 1,
        deck: 1,
        seat_cost: "100.000",
        bus: 1,
        seat_ui_order: 72,
        booked: [],
      },
      {
        id: 24,
        seat_number: "b6",
        seat_type: 1,
        deck: 1,
        seat_cost: "125.000",
        bus: 1,
        seat_ui_order: 73,
        booked: [],
      },
      {
        id: 25,
        seat_number: "b8",
        seat_type: 1,
        deck: 1,
        seat_cost: "100.000",
        bus: 1,
        seat_ui_order: 82,
        booked: [],
      },
      {
        id: 26,
        seat_number: "b9",
        seat_type: 1,
        deck: 1,
        seat_cost: "125.000",
        bus: 1,
        seat_ui_order: 83,
        booked: [],
      },
      {
        id: 27,
        seat_number: "b11",
        seat_type: 1,
        deck: 1,
        seat_cost: "100.000",
        bus: 1,
        seat_ui_order: 92,
        booked: [],
      },
      {
        id: 28,
        seat_number: "b12",
        seat_type: 0,
        deck: 1,
        seat_cost: "125.000",
        bus: 1,
        seat_ui_order: 93,
        booked: [],
      },
      {
        id: 29,
        seat_number: "b14",
        seat_type: 1,
        deck: 1,
        seat_cost: "100.000",
        bus: 1,
        seat_ui_order: 102,
        booked: [],
      },
      {
        id: 30,
        seat_number: "b15",
        seat_type: 1,
        deck: 1,
        seat_cost: "125.000",
        bus: 1,
        seat_ui_order: 103,
        booked: [
          {
            traveller_gender: 1,
            trip: 1,
          },
        ],
      },
    ];
    mock
      .onGet("user/view-seats/?trip_id=1&&start_location=2&&end_location=3")
      .reply(200, data);
    render(
      <SeatContextProvider>
        <UserLayout />
      </SeatContextProvider>
    );
  });

  it("renders card and catch error", () => {
    mock.onGet(`user/view-seats/?trip_id=1&&start_location=2&&end_location=3`);
    render(
      <SeatContextProvider>
        <UserLayout trip={1} startLocation={2} endLocation={3} />
      </SeatContextProvider>
    );
  });
});
