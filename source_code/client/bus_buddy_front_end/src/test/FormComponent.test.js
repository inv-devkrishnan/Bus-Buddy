import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FormComponent from "../components/BusOwner/SeatComponents/FormComponent";
import { AddSeatContextProvider } from "../utils/AddSeatContext";

describe("FormComponent component", () => {
  it("renders card", () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} />
      </AddSeatContextProvider>
    );
     const formSubmitButton = screen.getByText("Submit")
     fireEvent.click(formSubmitButton)

  });
});
