import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import Addtrips from "../components/BusOwnerUi/MyTrips/Addtrips"
describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <Addtrips />
        </MemoryRouter>
      );
  
  });
});