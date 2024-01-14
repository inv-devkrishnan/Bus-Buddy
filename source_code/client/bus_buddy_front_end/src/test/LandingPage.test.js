import React from "react";
import { render} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import LandingPage from "../pages/LandingPage";


jest.mock("../assets/images/landing_splash.jpg");
describe("landing Page", () => {
  test("landing Page render", () => {
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
