import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useNavigate } from 'react-router-dom';
import Ownerprofile from "../components/BusOwnerUi/Ownerprofile"
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({
    pathname: "/BusHome/ViewBus/", // Add the state object with the id property
  }),
}));
let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});
describe("OwnerProfile component", () => {
  useNavigate.mockImplementation(() => jest.fn());

  it("renders component", () => {
    render(
          <Ownerprofile />
      );
  
  });
});