import React from "react";
import { fireEvent, render, screen} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import LandingPage from "../pages/LandingPage";
import MockAdapter from "axios-mock-adapter";
import { openAxiosApi } from "../utils/axiosApi";
let mock;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
});

afterEach(() => {
  mock.restore();
});

jest.mock("../assets/images/landing_splash.jpg");

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
describe("landing Page", () => {
  test("landing Page render", async() => {
    mock.onGet(`get-location-data/`).reply(200, data);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <LandingPage />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  
    await new Promise(resolve => setTimeout(resolve, 2000));
    fireEvent.change(screen.getByPlaceholderText("From location"), {
      target: { value: "Trivandrum" },
    });
    fireEvent.change(screen.getByPlaceholderText("To location"), {
      target: { value: "Pathanamthitta" },
    });

    fireEvent.change(screen.getByTestId("date-selector"), {
      target: { value: "2024-12-12" },
    });
    fireEvent.click(screen.getByText("Search"));
  });

  test("landing Page render fail", () => {
    mock.onGet(`get-location-data/`).reply(400, { error_code: "5542" });
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <LandingPage />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });
});
