import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter,useLocation } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import SearchTrips from "../pages/SearchTrips";


jest.mock("../pages/LandingPage")
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));
describe("search trip Page", () => {
  test("search trip page render", () => {

    const mockLocation = {
      search: '?end-name=value1&start-name=value2&start=6&end=7&date=2024-12-12',
    };
  
    // Set up the useLocation mock implementation
    useLocation.mockReturnValue(mockLocation);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <SearchTrips />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });
  test("search trip page render invalid", () => {

    const mockLocation = {
      search: '?end-name=value1&start-name=value2&start=6&end=7&date=202412-12',
    };
  
    // Set up the useLocation mock implementation
    useLocation.mockReturnValue(mockLocation);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <SearchTrips />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });
});
