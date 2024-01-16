import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import UpdateAmenities from "../components/BusOwnerUi/MyBuses/UpdateAmenities"
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn().mockReturnValue({
    pathname: "../components/BusOwnerUi/MyBuses/ViewBus.jsx",
  }),
}));

describe("ReviewHistory component", () => {
  it("renders component", () => {
    const data = {
      "bus": 9,
      "emergency_no": 0,
      "water_bottle": 1,
      "charging_point": 0,
      "usb_port": 0,
      "blankets": 1,
      "pillows": 0,
      "reading_light": 0,
      "toilet": 0,
      "snacks": 0,
      "tour_guide": 0,
      "cctv": 0
  }
  mock.onGet(`http://127.0.0.1:8000/bus-owner/update-amenities/${9}/`).reply(200, data);
    render(
        <MemoryRouter>
          <UpdateAmenities />
        </MemoryRouter>
      );
  
  });
});