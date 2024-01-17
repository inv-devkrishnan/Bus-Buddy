import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SeatDescription from "../components/BusOwner/SeatComponents/SeatDescription";

jest.mock("../assets/sleeper.png");
jest.mock("../assets/maleSleeper.png");

describe("SeatDescription component", () => {
  it("renders card", () => {
    render(<SeatDescription />);
  });
});
