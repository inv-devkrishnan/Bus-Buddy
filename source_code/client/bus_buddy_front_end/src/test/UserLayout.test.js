import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserLayout from "../components/User/UserLayout";
import { SeatContextProvider } from "../utils/SeatContext";
import { openAxiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
});

afterEach(() => {
  mock.restore();
});

jest.mock("../assets/driver.png");

describe("UserLayout component", () => {
  it("renders card", () => {
    const data = {};
    mock
      .onGet(`user/view-seats/?trip_id=1&&start_location=2&&end_location=3`)
      .reply(200, data);
    render(
      <SeatContextProvider>
        <UserLayout trip={1} startLocation={2} endLocation={3} />
      </SeatContextProvider>
    );
  });

  it("renders card and catch error", () => {
    mock.onGet(`user/view-seats/?trip_id=1&&start_location=2&&end_location=3`);
    render(
      <SeatContextProvider>
        <UserLayout trip={1} startLocation={2} endLocation={3} />
      </SeatContextProvider>
    );
  });
});
