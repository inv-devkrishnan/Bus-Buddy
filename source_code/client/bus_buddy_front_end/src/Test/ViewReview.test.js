import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import ViewReviews from "../components/BusOwnerUi/MyReviews/ViewReviews"
describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <ViewReviews />
        </MemoryRouter>
      );
  
  });
});