import React from "react";
import { render,screen,fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import PassengerList from "../components/BusOwnerUi/MyTrips/Passengerlist";
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
    useLocation: jest.fn().mockReturnValue({
      state: 37, // Add the state object with the id property
    }),
  }));

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("View Passenger List component", () => {
  
  it("renders component success", async() => {
    const data = {
        "listlen": 8,
        "data": [
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "John",
                "seat_id": 96,
                "seat_number": "6"
            },
            {
                "traveller_gender": 2,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Shiny",
                "seat_id": 97,
                "seat_number": "7"
            },
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Antony",
                "seat_id": 98,
                "seat_number": "8"
            },
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Jose",
                "seat_id": 99,
                "seat_number": "9"
            },
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Biju",
                "seat_id": 100,
                "seat_number": "10"
            },
            {
                "traveller_gender": 2,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Bindu",
                "seat_id": 101,
                "seat_number": "11"
            },
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Anthony",
                "seat_id": 102,
                "seat_number": "12"
            },
            {
                "traveller_gender": 2,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Minna",
                "seat_id": 103,
                "seat_number": "13"
            }
        ]
    }
  

    mock.onGet(`bus-owner/passenger-list/${37}/`).reply(200, data);

    render(
      <MemoryRouter>
        <PassengerList />
      </MemoryRouter>
    );
    await new Promise(resolve => setTimeout(resolve, 2000));

    const serachButton = screen.getByText("Back to View Trips");
      fireEvent.click(serachButton);
});

it("renders component fail", async() => {
    const data = {
        "listlen": 8,
        "data": [
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "John",
                "seat_id": 96,
                "seat_number": "6"
            },
            {
                "traveller_gender": 2,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Shiny",
                "seat_id": 97,
                "seat_number": "7"
            },
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Antony",
                "seat_id": 98,
                "seat_number": "8"
            },
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Jose",
                "seat_id": 99,
                "seat_number": "9"
            },
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Biju",
                "seat_id": 100,
                "seat_number": "10"
            },
            {
                "traveller_gender": 2,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Bindu",
                "seat_id": 101,
                "seat_number": "11"
            },
            {
                "traveller_gender": 1,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Anthony",
                "seat_id": 102,
                "seat_number": "12"
            },
            {
                "traveller_gender": 2,
                "trip": {
                    "id": 37,
                    "start_date": "2024-01-26",
                    "end_date": "2024-01-26",
                    "start_time": "12:00:00",
                    "end_time": "14:00:00",
                    "status": 0,
                    "created_date": "2024-01-18T09:12:44.969848Z",
                    "updated_date": "2024-01-18T09:12:44.969873Z",
                    "bus": 4,
                    "route": 3,
                    "user": 1
                },
                "traveller_name": "Minna",
                "seat_id": 103,
                "seat_number": "13"
            }
        ]
    }
  

    mock.onGet(`bus-owner/passenger-list/${99}/`).reply(404, data);

    render(
      <MemoryRouter>
        <PassengerList />
      </MemoryRouter>
    );
    await new Promise(resolve => setTimeout(resolve, 2000));
});
});
