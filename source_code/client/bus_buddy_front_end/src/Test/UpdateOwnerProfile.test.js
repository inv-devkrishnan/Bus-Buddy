import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import UpdateOwnerProfile from "../components/BusOwnerUi/UpdateOwnerProfile";

describe("Update OwnerProfile component", () => {
  it("renders component", () => {
    render(
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <UpdateOwnerProfile />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
    );
  });
});
