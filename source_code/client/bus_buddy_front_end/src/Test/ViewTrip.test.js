import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import ViewTrips from "../components/BusOwnerUi/MyTrips/ViewTrips"
describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <ViewTrips />
        </MemoryRouter>
      );
  
  });
});