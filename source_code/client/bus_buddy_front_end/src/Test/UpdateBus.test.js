import React from "react";
import { fireEvent, render,screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter} from 'react-router-dom';
import UpdateBus from "../components/BusOwnerUi/MyBuses/UpdateBus"
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({
    state: { id: 9 }, // Add the state object with the id property
    pathname: "../components/BusOwnerUi/MyBuses/ViewBus.jsx",
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
      "bus_name": "Shamida",
      "plate_no": "KL08AC9799",
      "bus_seat_type": 0,
      "status": 0,
      "bus_type": 0,
      "bus_ac": 0,
      "bus_details_status": 1,
      "created_date": "2024-01-10T11:30:02.078000Z",
      "updated_date": "2024-01-10T11:39:33.619868Z",
      "user": 1
  }
    mock.onGet(`bus-owner/update-bus/${9}/`).reply(200, data);

    mock.onPut(`bus-owner/update-bus/${9}/`).reply(200, data);
    


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

    
      const update = screen.getByText("Update");
      fireEvent.click(update)
  });
});