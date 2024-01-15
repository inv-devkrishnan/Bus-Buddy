import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import ViewBus from "../components/BusOwnerUi/MyBuses/ViewBus"
describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <ViewBus />
        </MemoryRouter>
      );
  
  });
});