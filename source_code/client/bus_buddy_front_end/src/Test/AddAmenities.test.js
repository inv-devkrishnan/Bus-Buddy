import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import AddAmenities from "../components/BusOwnerUi/MyBuses/AddAmenities"
describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <AddAmenities />
        </MemoryRouter>
      );
  
  });
});