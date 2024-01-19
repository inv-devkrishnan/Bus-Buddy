import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from "react-router-dom";
import Addrecurringtrip from "../components/BusOwnerUi/MyTrips/Addrecurringtrip";
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

jest.mock("date-fns", () => {
  const originalDate = jest.requireActual("date-fns");

  return {
    ...originalDate,
    Date: jest.fn(() => new originalDate.Date("2024-01-16")), // Change the date to the desired value
  };
});

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("Add Recurring Trip component", () => {
  it("renders component", async () => {
    const data = [
      {
        id: 1,
        bus_name: "Sera",
        plate_no: "KL08AZ7887",
        bus_type: 0,
        bus_ac: 0,
        amenities_data: [
          {
            id: 1,
            emergency_no: 0,
            water_bottle: 1,
            charging_point: 1,
            usb_port: 1,
            blankets: 1,
            pillows: 1,
            reading_light: 1,
            toilet: 0,
            snacks: 1,
            tour_guide: 1,
            cctv: 1,
            status: 0,
            created_date: "2023-12-14T07:09:58.316833Z",
            updated_date: "2023-12-29T05:51:36.868706Z",
            bus: 1,
          },
        ],
        user: 1,
      },
      {
        id: 2,
        bus_name: "Jabbar",
        plate_no: "KL08AZ7889",
        bus_type: 0,
        bus_ac: 0,
        amenities_data: [
          {
            id: 2,
            emergency_no: 0,
            water_bottle: 0,
            charging_point: 0,
            usb_port: 0,
            blankets: 1,
            pillows: 1,
            reading_light: 0,
            toilet: 1,
            snacks: 0,
            tour_guide: 1,
            cctv: 1,
            status: 0,
            created_date: "2023-12-14T10:13:34.463915Z",
            updated_date: "2023-12-14T10:13:34.463953Z",
            bus: 2,
          },
        ],
        user: 1,
      },
      {
        id: 3,
        bus_name: "Kallada",
        plate_no: "KL10AZ7887",
        bus_type: 1,
        bus_ac: 0,
        amenities_data: [
          {
            id: 3,
            emergency_no: 1,
            water_bottle: 0,
            charging_point: 0,
            usb_port: 1,
            blankets: 0,
            pillows: 0,
            reading_light: 0,
            toilet: 0,
            snacks: 1,
            tour_guide: 0,
            cctv: 1,
            status: 0,
            created_date: "2023-12-14T10:15:57.785127Z",
            updated_date: "2023-12-14T10:15:57.785166Z",
            bus: 3,
          },
        ],
        user: 1,
      },
      {
        id: 4,
        bus_name: "St:Antony",
        plate_no: "KL08AZ1087",
        bus_type: 0,
        bus_ac: 0,
        amenities_data: [
          {
            id: 4,
            emergency_no: 1,
            water_bottle: 0,
            charging_point: 0,
            usb_port: 1,
            blankets: 1,
            pillows: 0,
            reading_light: 1,
            toilet: 0,
            snacks: 0,
            tour_guide: 1,
            cctv: 1,
            status: 0,
            created_date: "2023-12-14T10:16:49.143244Z",
            updated_date: "2023-12-14T10:16:49.143337Z",
            bus: 4,
          },
        ],
        user: 1,
      },
    ];

    mock
      .onGet(
        `bus-owner/view-available-bus/?start=${"2024-01-16"}&end=${"2024-12-25"}`
      )
      .reply(200, data);
    render(
      <MemoryRouter>
        <Addrecurringtrip />
      </MemoryRouter>
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const periodStartField = screen.getByLabelText("Start Date :");
    fireEvent.change(periodStartField, { target: { value: "2024-01-16" } });

    const periodEndField = screen.getByLabelText("End Date :");
    fireEvent.change(periodEndField, { target: { value: "2024-12-25" } });

    const searchButton = screen.getByText("search");
    fireEvent.click(searchButton);

    const startDateField = screen.getByLabelText("Start Date:");
    fireEvent.change(startDateField, { target: { value: "2024-01-16" } });

    const endDateField = screen.getByLabelText("End Date:");
    fireEvent.change(endDateField, { target: { value: "2024-01-16" } });

    const busSelect = screen.getByTestId("bus-select");
    fireEvent.change(busSelect, { target: { value: "1" } });

    const routeSelect = screen.getByTestId("route-select");
    fireEvent.change(routeSelect, { target: { value: "3" } });

    const recurrenceSelect = screen.getByTestId("recurrence-select");
    fireEvent.change(recurrenceSelect, { target: { value: "1" } });

    const addTrip = screen.getByText("Add");
    fireEvent.click(addTrip);
  });
});
