import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PickAndDrop from "../components/User/PickAndDrop";
import { SeatContextProvider } from "../utils/SeatContext";

describe("PickAndDrop component", () => {
  it("renders component", () => {
    render(
      <SeatContextProvider>
        <PickAndDrop
          selectionModelPick={[1, "pickup"]}
          setSelectionModelPick={jest.fn()}
          selectionModelDrop={[2, "dropoff"]}
          setSelectionModelDrop={jest.fn()}
          setSelectedPickStop={jest.fn()}
          setSelectedDropStop={jest.fn()}
        />
      </SeatContextProvider>
    );
  });
});
