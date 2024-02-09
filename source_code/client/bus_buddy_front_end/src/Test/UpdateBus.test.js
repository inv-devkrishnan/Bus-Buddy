import React from "react";
import { fireEvent, render,screen,waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter} from 'react-router-dom';
import UpdateBus from "../components/BusOwnerUi/MyBuses/UpdateBus"
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({
    state:9, // Add the state object with the id property
  }),
}));




let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("Update Bus component", () => {
  it("renders component", async() => {
    const data = {
      "id": 9,
      "bus_name": "Sera",
      "plate_no": "KL08AZ7887",
      "bus_seat_type": 0,
      "status": 0,
      "bus_type": 0,
      "bus_ac": 0,
      "bus_details_status": 2,
      "created_date": "2023-12-14T07:09:43.785033Z",
      "updated_date": "2023-12-29T05:51:30.075291Z",
      "user": 1
  }
  const updateData = {
    "bus_name": "Anthony",
    "user": 1,
    "plate_no": "KL 32 A 7099",
    "bus_type": 2,
    "bus_ac": 0
}
    mock.onGet(`bus-owner/update-bus/${9}/`).reply(200, data)
   


    render(
        <MemoryRouter>
          <UpdateBus />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));

      const busName = screen.getByTestId("busName");
      fireEvent.change(busName,{target :{value :"Joseph"}});

      const plateNo = screen.getByTestId("plateNo");
      fireEvent.change(plateNo, {target : {value :"KL08AC78787"}})
      
      const busType = screen.getByTestId("busType");
      fireEvent.change(busType,{target : {value :"1"}});

      const busSeatType = screen.getByTestId("busSeatType");
      fireEvent.change(busSeatType,{target :{value :"1"}});
      
      const busAcType = screen.getByTestId("busAcType");
      fireEvent.change(busAcType,{target :{value :"1"}});

      const update = screen.getByText("Update");
      fireEvent.click(update)


    await waitFor(() => {
      mock.onPut(`bus-owner/update-bus/${9}/`).reply(200, updateData);
    });
  }, 500000);

  it("renders component get fail", async() => {
    const data = {
      "id": 9,
      "bus_name": "Sera",
      "plate_no": "KL08AZ7887",
      "bus_seat_type": 0,
      "status": 0,
      "bus_type": 0,
      "bus_ac": 0,
      "bus_details_status": 2,
      "created_date": "2023-12-14T07:09:43.785033Z",
      "updated_date": "2023-12-29T05:51:30.075291Z",
      "user": 1
  }
  const updateData = {
    "bus_name": "Anthony",
    "user": 1,
    "plate_no": "KL 32 A 7099",
    "bus_type": 2,
    "bus_ac": 0
}
    mock.onGet(`bus-owner/update-bus/${109}/`).reply(200, data)
   


    render(
        <MemoryRouter>
          <UpdateBus />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));

      const busName = screen.getByTestId("busName");
      fireEvent.change(busName,{target :{value :"Joseph"}});

      const plateNo = screen.getByTestId("plateNo");
      fireEvent.change(plateNo, {target : {value :"KL08AC78787"}})
      
      const busType = screen.getByTestId("busType");
      fireEvent.change(busType,{target : {value :"1"}});

      const busSeatType = screen.getByTestId("busSeatType");
      fireEvent.change(busSeatType,{target :{value :"1"}});
      
      const busAcType = screen.getByTestId("busAcType");
      fireEvent.change(busAcType,{target :{value :"1"}});

      const update = screen.getByText("Update");
      fireEvent.click(update)


    await waitFor(() => {
      mock.onPut(`bus-owner/update-bus/${9}/`).reply(200, updateData);
    });
  }, 500000);

});