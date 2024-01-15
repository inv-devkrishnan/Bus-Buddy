import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import UpdateAmenities from "../components/BusOwnerUi/MyBuses/UpdateAmenities"
describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <UpdateAmenities />
        </MemoryRouter>
      );
  
  });
});