import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import "@testing-library/jest-dom/extend-expect";
import Addroutes from "../components/BusOwnerUi/MyRoutes/Addroutes";

jest.mock("../assets/route.jpg")

describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(
        <MemoryRouter>
          <Addroutes />
        </MemoryRouter>
      );
  });
});