import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import FormComponent from "../components/BusOwner/SeatComponents/FormComponent";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("FormComponent component", () => {
  it("renders card", () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={0} />
      </AddSeatContextProvider>
    );
  });

  it("form submit", async () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={1} />
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: "123" } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: "50" } });

    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    await mock.onPost("bus-owner/add-seat-details").reply(201);
  });

  it("form submit success else", async () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={2} />
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: "123" } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: "50" } });

    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    await mock.onPost("bus-owner/add-seat-details").reply(204);

    // Add any additional assertions if needed
  });

  it("form submit catch error", async () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={0} />
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: "123" } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: "50" } });

    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    await mock
      .onPost("bus-owner/add-seat-details")
      .reply(400, { seat_ui_order: "error" });

    // Add any additional assertions if needed
  });

  it("form submit catch error 2", async () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={0} />
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: "123" } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: "50" } });

    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    await mock
      .onPost("bus-owner/add-seat-details")
      .reply(400, { data: "error" });

    // Add any additional assertions if needed
  });

  it("form submit catch error 3", async () => {
    render(
      <AddSeatContextProvider>
        <FormComponent bus={1} seatType={0} />
      </AddSeatContextProvider>
    );

    const numberTextbox = screen.getByLabelText("Enter seat number");
    fireEvent.change(numberTextbox, { target: { value: "123" } });

    const costTextbox = screen.getByLabelText("Enter seat cost");
    fireEvent.change(costTextbox, { target: { value: "50" } });

    const submitButton = screen.getByText("Submit");

    fireEvent.click(submitButton);

    await mock
      .onPost("bus-owner/add-seat-details")
      .reply(400, { error: "error" });

    // Add any additional assertions if needed
  });
});
