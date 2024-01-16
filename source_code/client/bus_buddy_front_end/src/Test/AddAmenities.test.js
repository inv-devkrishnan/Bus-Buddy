import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import AddAmenities from "../components/BusOwnerUi/MyBuses/AddAmenities"

import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("ReviewHistory component", () => {
  it("renders component",async () => {
    const data = {
      "bus": 48,
      "emergency_no": 0,
      "water_bottle": 0,
      "charging_point": 0,
      "usb_port": 0,
      "blankets": 0,
      "pillows": 0,
      "reading_light": 0,
      "toilet": 0,
      "snacks": 0,
      "tour_guide": 0,
      "cctv": 0
  } 

  mock.onGet("http://localhost:8000/bus-owner/add-amenities/",).reply(200, data);

    render(
        <MemoryRouter>
          <AddAmenities />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
      

      const checkButtons = screen.getAllByTestId("check-button");
      fireEvent.change(checkButtons[0]);

      const addAmenitiesButtons = screen.getByText("Add Amenities");
      fireEvent.click(addAmenitiesButtons);
  
  });
});