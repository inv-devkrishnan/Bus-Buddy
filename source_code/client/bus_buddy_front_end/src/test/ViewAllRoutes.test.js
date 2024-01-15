import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ViewAllRoutes from "../components/ViewAllRoutes";

describe("ViewAllRoutes component", () => {
  it("renders component", () => {
    render(<ViewAllRoutes />);
  });
});
