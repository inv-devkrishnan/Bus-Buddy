import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TravellerDetail from "../components/User/TravellerDetail";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

const currentTrip = {
  data: {
    amenities: {
      emergency_no: 1,
      water_bottle: 1,
      charging_point: 1,
      usb_port: 1,
      blankets: 1,
      pillows: 1,
      reading_light: 0,
      snacks: 0,
      toilet: 0,
      tour_guide: 0,
      cctv: 1,
    },
    bus: 1,
    bus_name: "Tara",
    company_name: "Shekar travels",
    end_location_arrival_date: "2024-01-31",
    end_location_arrival_time: "14:20:00",
    gst: 18,
    route: 1,
    route_cost: 2488,
    start_location_arrival_date: "2024-01-31",
    start_location_arrival_time: "10:00:00",
    travel_fare: 2588,
    trip: 4,
    via: "Alappuzha",
    endLocation: "10",
    endLocationName: "Thiruvananthapuram",
    isOpen: true,
    seatViewOpen: 0,
    startLocation: "2",
    startLocationName: "Ernakulam",
  },
};

jest.mock("../utils/hooks/useAuth", () => ({
  ...jest.requireActual("../utils/hooks/useAuth"),
  useAuthStatus: jest.fn().mockReturnValue(true),
}));

describe("TravellerDetail component", () => {
  localStorage.setItem("total_amount", 1000);
  localStorage.setItem(
    "seat_list",
    ' [{"id":18,"seat_number":"b7","seat_type":1,"deck":1,"seat_cost":"150.000","bus":1,"seat_ui_order":81,"booked":[],"female_only":false,"male_only":false}]'
  );
  localStorage.setItem("current_trip", JSON.stringify(currentTrip));

  it("renders component unauthorized", () => {
    localStorage.setItem("user_role", 11);

    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <TravellerDetail />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });

  it("renders component", async () => {
    localStorage.setItem("user_role", 2);

    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <TravellerDetail />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const nameTextbox = screen.getByPlaceholderText("Enter name");
    fireEvent.change(nameTextbox, { target: { value: "name" } });

    const dob = screen.getByPlaceholderText("Enter DOB");
    fireEvent.change(dob, { target: { value: "2024-12-12" } });

    const radio = screen.getByTestId("gender-radio")
    fireEvent.click(radio)

    const bookButton = screen.getByText("Book Seat")
    fireEvent.click(bookButton)
    mock.onPost("user/create-payment-intent/").reply(200)
  });
});
