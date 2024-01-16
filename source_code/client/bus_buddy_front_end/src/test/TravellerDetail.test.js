import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import TravellerDetail from "../components/User/TravellerDetail";
import { useNavigate } from "react-router-dom";

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
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));
jest.mock("react-bootstrap", () => ({
  ...jest.requireActual("react-bootstrap"),
  Card: jest.fn(),
}));
jest.mock("../utils/hooks/useAuth", () => ({
  ...jest.requireActual("../utils/hooks/useAuth"),
  useAuthStatus: jest.fn().mockReturnValue(true),
}));
jest.mock("../utils/reduce", () => ({
  ...jest.requireActual("../utils/reduce"),
  applyReduce: jest.fn().mockReturnValue({
    id: 1,
    seat_number: "a",
    seat_type: 1,
    deck: 1,
    seat_cost: 100,
    name_1: "name",
    dob_1: 10 - 12 - 2000,
    gender_1: 1,
  }),
}));

describe("TravellerDetail component", () => {
  useNavigate.mockImplementation(() => jest.fn());
  useContext.mockImplementation(() => jest.fn());
  localStorage.setItem("total_amount", 1000);
  localStorage.setItem(
    "seat_list",
    ' [{"id":18,"seat_number":"b7","seat_type":1,"deck":1,"seat_cost":"150.000","bus":1,"seat_ui_order":81,"booked":[],"female_only":false,"male_only":false}]'
  );
  localStorage.setItem("current_trip", JSON.stringify(currentTrip));

  it("renders component", () => {
    render(<TravellerDetail />);
  });

  it("renders component-useEffect else part", async () => {
    localStorage.setItem("user_role", "2");
    render(<TravellerDetail />);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
});
