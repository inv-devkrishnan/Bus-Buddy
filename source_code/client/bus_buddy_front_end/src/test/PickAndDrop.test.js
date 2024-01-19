import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import PickAndDrop from "../components/User/PickAndDrop";
import { SeatContextProvider } from "../utils/SeatContext";

localStorage.setItem("pick_up", 1);
localStorage.setItem("drop_off", 1);
localStorage.setItem("pick_stop", "pickup");
localStorage.setItem("drop_stop", "dropoff");


describe("PickAndDrop component", () => {
  it("renders component", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
