import React, { useContext } from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ViewSeatDetails from "../pages/ViewSeatDetails";
import { Card } from "@mui/material";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  Card: jest.fn(),
}));
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(),
}));

const mockContextValue = {
  seatList: [],
  updateSeatList: jest.fn(),
  seatData: [],
  updateSeatData: jest.fn(),
  tripID: 1,
  updateTripID: jest.fn(),
};

describe("ViewSeatDetails component", () => {
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
  React.useContext.mockReturnValue(mockContextValue);
  Card.mockImplementation(() => jest.fn());

  it("renders component", () => {
    render(
      <ViewSeatDetails
        currentTrip={currentTrip}
        routeCost={1000}
        gst={18}
        startLocation={"Ernakulam"}
        endLocation={"Thiruvananthapuram"}
      />
    );
  });
});
