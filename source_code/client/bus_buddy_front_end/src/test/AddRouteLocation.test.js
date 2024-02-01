import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MockAdapter from "axios-mock-adapter";
import { axiosApi, openAxiosApi } from "../utils/axiosApi";
import AddRouteCard from "../components/AddRouteCard";

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("../assets/route.jpg");

let mock;
let mockClosedApi;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
  mockClosedApi = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
  mockClosedApi.restore();
});

const data = [
  {
    id: 1,
    location_name: "Trivandrum",
  },
  {
    id: 2,
    location_name: "Pathanamthitta",
  },
  {
    id: 3,
    location_name: "Kottayam",
  },
  {
    id: 4,
    location_name: "Kollam",
  },
  {
    id: 5,
    location_name: "Kozhikode",
  },
  {
    id: 6,
    location_name: "Ernakulam",
  },
  {
    id: 7,
    location_name: "Thrissur",
  },
  {
    id: 8,
    location_name: "Palakad",
  },
];

it("add stop and location  invalid offset difference", async() => {
   
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard stopLocations={[1,2]} />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "10:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    
  });


  it("01 test add stop and location  invalid time", async() => {
   
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "12:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    
  });