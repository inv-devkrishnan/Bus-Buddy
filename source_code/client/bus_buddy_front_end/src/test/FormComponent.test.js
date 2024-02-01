import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FormComponent from "../components/BusOwner/SeatComponents/FormComponent";
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

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  AddSeatContext: jest.fn().mockReturnValue({
    propsData: 11,
    currentData: [
      {
        bus: 1,
        seat_ui_order: 11,
        seat_number: "1",
        seat_type: 0,
        deck: 0,
        seat_cost: 200,
      },
    ],
    currentSeatData: [
      {
        bus: 1,
        seat_ui_order: 11,
        seat_number: "1",
        seat_type: 0,
        deck: 0,
        seat_cost: 200,
      },
    ],
    updateCurrentSeatData: jest.fn(),
    reRender: false,
    updateReRender: jest.fn(),
  }),
}));

describe("FormComponent component", () => {
  it("renders card", () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={0}/>
      </AddSeatContextProvider>
    );
  });

  it("form submit", () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={1}/>
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: 1 } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: 0 } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    mock.onPost("bus-owner/add-seat-details").reply(201);
  });

  it("form submit success else", () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={2}/>
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: 1 } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: 0 } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    mock.onPost("bus-owner/add-seat-details").reply(204);
  });

  it("form submit catch error", () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={0}/>
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: 1 } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: 0 } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    mock
      .onPost("bus-owner/add-seat-details")
      .reply(400, { seat_ui_order: "error" });
  });

  it("form submit catch error 2", () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={0}/>
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: 1 } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: 0 } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    mock.onPost("bus-owner/add-seat-details").reply(400, { data: "error" });
  });
  it("form submit catch error 3", () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={0}/>
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: 1 } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: 0 } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    mock.onPost("bus-owner/add-seat-details").reply(400, { error: "error" });
  });
});
