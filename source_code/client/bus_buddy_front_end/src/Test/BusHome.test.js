import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import BusHome from "../components/BusOwnerUi/BusHome"
describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <BusHome />
        </MemoryRouter>
      );
  
  });
});