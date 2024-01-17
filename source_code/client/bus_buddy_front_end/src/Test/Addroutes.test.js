import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Addroutes from "../components/BusOwnerUi/MyRoutes/Addroutes.jsx";
import { MemoryRouter } from 'react-router-dom';

jest.mock("../components/AddRouteCard.jsx");
describe("Add Routes component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <Addroutes />
        </MemoryRouter>
      );
  });
});