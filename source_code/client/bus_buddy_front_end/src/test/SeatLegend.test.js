import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SeatLegend from "../components/User/SeatLegend";

jest.mock("../assets/sleeper.png");
jest.mock("../assets/femaleSleeper.png");
jest.mock("../assets/maleSeater.png");

describe("SeatDetailCard component", () => {
  it("renders component", () => {
    render(<SeatLegend />);
  });
});
