import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RegisterCard from "../components/User/RegisterCard";
import { SeatContextProvider } from "../utils/SeatContext";
import AddSeatContextProvider from "../utils/AddSeatContext.jsx";

jest.mock("../utils/AddSeatContext.jsx");
jest.mock("../utils/SeatContext.jsx");

describe("RegisterCard component", () => {
  it("renders component", () => {
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <RegisterCard />
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });
});
