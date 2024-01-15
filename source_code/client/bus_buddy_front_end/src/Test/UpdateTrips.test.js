import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import UpdateTrips from "../components/BusOwnerUi/MyTrips/UpdateTrips"
describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <UpdateTrips />
        </MemoryRouter>
      );
  
  });
});