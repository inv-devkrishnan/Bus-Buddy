import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';



describe("Add Bus component", () => {
  it("renders component", () => {
    render(
      <MemoryRouter>
        <AddBus />
      </MemoryRouter>
    );
  });
});