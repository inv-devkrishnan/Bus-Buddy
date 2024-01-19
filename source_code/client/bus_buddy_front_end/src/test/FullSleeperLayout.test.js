import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FullSleeperLayout from "../components/BusOwner/SeatComponents/Layouts/FullSleeperLayout";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;
beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});
jest.mock("../assets/driver.png");
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  AddSeatContext: jest.fn().mockReturnValue({
    updateCurrentData: jest.fn(),
    reRender: true,
  }),
}));
describe("FullSleeperLayout component", () => {
  it("renders card", () => {
    mock.onGet(`bus-owner/get-seat-details?bus_id=${1}`).reply(200);
    render(
      <AddSeatContextProvider>
        <FullSleeperLayout bus={1} />
      </AddSeatContextProvider>
    );
  });
  it("renders card catch", () => {
    mock.onGet(`bus-owner/get-seat-details?bus_id=${1}`).reply(400);
    render(
      <AddSeatContextProvider>
        <FullSleeperLayout bus={1} />
      </AddSeatContextProvider>
    );
  });
});
