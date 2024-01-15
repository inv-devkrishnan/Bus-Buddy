import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import UpdateBus from "../components/BusOwnerUi/MyBuses/UpdateBus"
describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <UpdateBus />
        </MemoryRouter>
      );
  
  });
});