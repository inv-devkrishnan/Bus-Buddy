import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import OwnerRegisterCard from "../components/OwnerRegisterCard.jsx";
import { SeatContextProvider } from "../utils/SeatContext";
import AddSeatContextProvider from "../utils/AddSeatContext.jsx";

jest.mock("../utils/AddSeatContext.jsx");
jest.mock("../utils/SeatContext.jsx");

describe("OwnerRegisterCard component", () => {
  it("renders component", () => {
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <OwnerRegisterCard />
        </AddSeatContextProvider>
      </SeatContextProvider>
    );
  });
});
