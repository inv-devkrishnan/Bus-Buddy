import React from "react";
import { fireEvent, render,screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import AddBus from "../components/BusOwnerUi/MyBuses/AddBus"
describe("Add Bus component", () => {
  it("renders component",async () => {
    render(
        <MemoryRouter>
          <AddBus />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
      const busName = screen.getByPlaceholderText("Bus name")
      fireEvent.change(busName,{target : {value :"Farzana"}})

      const plateNo = screen.getByPlaceholderText("Plate Number")
      fireEvent.change(plateNo,{target : {value : "KL09AC7898"}})

      const busTypeSelect = screen.getByTestId("bus-type-select");
      fireEvent.change(busTypeSelect, { target: { value: "1" } });

      const busSeatType = screen.getByTestId("bus-seat-type-select");
      fireEvent.change(busSeatType,{target : {value: "1"}});

      const busAc = screen.getByTestId("bus-ac-type-select");
      fireEvent.change(busAc,{target : {value:"1"}});

      const addButton = screen.getByText("Add");
      fireEvent.click(addButton);
      
      

  });

  it("cannot add",async () => {
    render(
        <MemoryRouter>
          <AddBus />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
      const busName = screen.getByPlaceholderText("Bus name")
      fireEvent.change(busName,{target : {value :""}})

      const plateNo = screen.getByPlaceholderText("Plate Number")
      fireEvent.change(plateNo,{target : {value : "KL09AC7898"}})

      const busTypeSelect = screen.getByTestId("bus-type-select");
      fireEvent.change(busTypeSelect, { target: { value: "1" } });

      const busSeatType = screen.getByTestId("bus-seat-type-select");
      fireEvent.change(busSeatType,{target : {value: "1"}});

      const busAc = screen.getByTestId("bus-ac-type-select");
      fireEvent.change(busAc,{target : {value:"1"}});

      const addButton = screen.getByText("Add");
      fireEvent.click(addButton);
      
      

  });

  it("cannot add plate no",async () => {
    render(
        <MemoryRouter>
          <AddBus />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
      const busName = screen.getByPlaceholderText("Bus name")
      fireEvent.change(busName,{target : {value :"Farzana"}})

      const plateNo = screen.getByPlaceholderText("Plate Number")
      fireEvent.change(plateNo,{target : {value : "KL 09 AC 7898"}})

      const busTypeSelect = screen.getByTestId("bus-type-select");
      fireEvent.change(busTypeSelect, { target: { value: "1" } });

      const busSeatType = screen.getByTestId("bus-seat-type-select");
      fireEvent.change(busSeatType,{target : {value: "1"}});

      const busAc = screen.getByTestId("bus-ac-type-select");
      fireEvent.change(busAc,{target : {value:"1"}});

      const addButton = screen.getByText("Add");
      fireEvent.click(addButton);
      
      

  });

});