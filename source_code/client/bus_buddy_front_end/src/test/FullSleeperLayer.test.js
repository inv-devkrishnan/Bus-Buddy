import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FullSleeperLayer from "../components/BusOwner/SeatComponents/Layers/FullSleeperLayer";

jest.mock("../components/BusOwner/SeatComponents/Sleeper.jsx");

describe("FullSleeperLayer component", () => {
  it("renders card", () => {
    render(<FullSleeperLayer row={1} />);
  });
});
