import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import SearchTrips from "../pages/SearchTrips";

describe("search trip Page", () => {
  test("search trip page render", () => {
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
