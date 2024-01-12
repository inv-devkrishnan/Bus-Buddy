import React from "react";
import { useNavigate } from "react-router-dom";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SeatDetailCard from "../components/User/SeatDetailCard";
import { SeatContextProvider } from "../utils/SeatContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("../components/User/SeatLegend.jsx");

describe("SeatDetailCard component", () => {
  useNavigate.mockImplementation(() => jest.fn());
  it("renders component", () => {
    render(
      <SeatContextProvider>
        <SeatDetailCard
          selectionModelPick={[1]}
          selectionModelDrop={[2]}
          selectedPickStop={"pickup"}
          selectedDropStop={"dropoff"}
          routeCost={1000}
          gst={18}
        />
      </SeatContextProvider>
    );
  });
});
