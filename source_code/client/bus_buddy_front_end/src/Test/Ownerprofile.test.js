import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import Ownerprofile from "../components/BusOwnerUi/Ownerprofile"
describe("OwnerProfile component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <Ownerprofile />
        </MemoryRouter>
      );
  
  });
});