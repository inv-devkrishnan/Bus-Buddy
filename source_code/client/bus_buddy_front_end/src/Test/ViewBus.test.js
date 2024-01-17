import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import ViewBus from "../components/BusOwnerUi/MyBuses/ViewBus";
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("View bus component", () => {
  it("renders component", async() => {
    const data = {
      "page_size": 15,
      "total_objects": 5,
      "total_pages": 1,
      "current_page_number": 1,
      "has_next": false,
      "next": null,
      "has_previous": false,
      "previous": null,
      "results": [
          {
              "id": 9,
              "bus_name": "Shamida",
              "plate_no": "KL08AC9799",
              "bus_type": 0,
              "bus_ac": 0,
              "amenities_data": [
                  {
                      "id": 9,
                      "emergency_no": 0,
                      "water_bottle": 0,
                      "charging_point": 1,
                      "usb_port": 1,
                      "blankets": 1,
                      "pillows": 0,
                      "reading_light": 0,
                      "toilet": 0,
                      "snacks": 0,
                      "tour_guide": 0,
                      "cctv": 1,
                      "status": 0,
                      "created_date": "2024-01-10T11:31:00.093031Z",
                      "updated_date": "2024-01-10T11:31:00.093055Z",
                      "bus": 9
                  }
              ],
              "user": 1
          },
          {
              "id": 4,
              "bus_name": "St:Antony",
              "plate_no": "KL08AZ1087",
              "bus_type": 0,
              "bus_ac": 0,
              "amenities_data": [
                  {
                      "id": 4,
                      "emergency_no": 1,
                      "water_bottle": 0,
                      "charging_point": 0,
                      "usb_port": 1,
                      "blankets": 1,
                      "pillows": 0,
                      "reading_light": 1,
                      "toilet": 0,
                      "snacks": 0,
                      "tour_guide": 1,
                      "cctv": 1,
                      "status": 0,
                      "created_date": "2023-12-14T10:16:49.143244Z",
                      "updated_date": "2023-12-14T10:16:49.143337Z",
                      "bus": 4
                  }
              ],
              "user": 1
          },
          {
              "id": 3,
              "bus_name": "Kallada",
              "plate_no": "KL10AZ7887",
              "bus_type": 1,
              "bus_ac": 0,
              "amenities_data": [
                  {
                      "id": 3,
                      "emergency_no": 1,
                      "water_bottle": 0,
                      "charging_point": 0,
                      "usb_port": 1,
                      "blankets": 0,
                      "pillows": 0,
                      "reading_light": 0,
                      "toilet": 0,
                      "snacks": 1,
                      "tour_guide": 0,
                      "cctv": 1,
                      "status": 0,
                      "created_date": "2023-12-14T10:15:57.785127Z",
                      "updated_date": "2023-12-14T10:15:57.785166Z",
                      "bus": 3
                  }
              ],
              "user": 1
          },
          {
              "id": 2,
              "bus_name": "Jabbar",
              "plate_no": "KL08AZ7889",
              "bus_type": 0,
              "bus_ac": 0,
              "user": 1
          },
          {
              "id": 1,
              "bus_name": "Sera",
              "plate_no": "KL08AZ7887",
              "bus_type": 0,
              "bus_ac": 0,
              "amenities_data": [
                  {
                      "id": 1,
                      "emergency_no": 0,
                      "water_bottle": 1,
                      "charging_point": 1,
                      "usb_port": 1,
                      "blankets": 1,
                      "pillows": 1,
                      "reading_light": 1,
                      "toilet": 0,
                      "snacks": 1,
                      "tour_guide": 1,
                      "cctv": 1,
                      "status": 0,
                      "created_date": "2023-12-14T07:09:58.316833Z",
                      "updated_date": "2023-12-29T05:51:36.868706Z",
                      "bus": 1
                  }
              ],
              "user": 1
          }
      ]
  }

  const deleteData = {
    "id": 9,
    "bus_name": "Shamida",
    "plate_no": "KL08AC9799",
    "bus_type": 0,
    "bus_ac": 0,
    "amenities_data": [
        {
            "id": 9,
            "emergency_no": 0,
            "water_bottle": 0,
            "charging_point": 1,
            "usb_port": 1,
            "blankets": 1,
            "pillows": 0,
            "reading_light": 0,
            "toilet": 0,
            "snacks": 0,
            "tour_guide": 0,
            "cctv": 1,
            "status": 0,
            "created_date": "2024-01-10T11:31:00.093031Z",
            "updated_date": "2024-01-10T11:31:00.093055Z",
            "bus": 9
        }
    ],
    "user": 1
}

    mock.onGet(`bus-owner/view-bus/?page=${1}`).reply(200, data);
    mock.onPut(`bus-owner/delete-bus/${9}/`).reply(200, deleteData);

    render(
      <MemoryRouter>
        <ViewBus />
      </MemoryRouter>
    );
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updateButtons = screen.getAllByTestId("update-button");
    fireEvent.click(updateButtons[0]);

    const deleteButtons = screen.getAllByTestId("delete-button");
    fireEvent.click(deleteButtons[0]);

    const addSeatButtons = screen.getAllByTestId("add-seat-button");
    fireEvent.click(addSeatButtons[0]);

    const accordianButtons = screen.getAllByTestId("accordian-button");
    fireEvent.click(accordianButtons[0]);

    const updateAmenitiesButtons = screen.getAllByTestId("update-amenities-button");
    fireEvent.click(updateAmenitiesButtons[0]);

    const addAmenitiesButtons = screen.getAllByTestId("add-amenities-button");
    fireEvent.click(addAmenitiesButtons[0]);
    
    const addBusButton = screen.getByText("+ Add Bus");
    fireEvent.click(addBusButton);

    
  });

  it("renders component success", async() => {
    const data = {
      "page_size": 15,
      "total_objects": 5,
      "total_pages": 1,
      "current_page_number": 1,
      "has_next": false,
      "next": null,
      "has_previous": false,
      "previous": null,
      "results": [
          {
              "id": 9,
              "bus_name": "Shamida",
              "plate_no": "KL08AC9799",
              "bus_type": 0,
              "bus_ac": 0,
              "amenities_data": [
                  {
                      "id": 9,
                      "emergency_no": 0,
                      "water_bottle": 0,
                      "charging_point": 1,
                      "usb_port": 1,
                      "blankets": 1,
                      "pillows": 0,
                      "reading_light": 0,
                      "toilet": 0,
                      "snacks": 0,
                      "tour_guide": 0,
                      "cctv": 1,
                      "status": 0,
                      "created_date": "2024-01-10T11:31:00.093031Z",
                      "updated_date": "2024-01-10T11:31:00.093055Z",
                      "bus": 9
                  }
              ],
              "user": 1
          },
          {
              "id": 4,
              "bus_name": "St:Antony",
              "plate_no": "KL08AZ1087",
              "bus_type": 0,
              "bus_ac": 0,
              "amenities_data": [
                  {
                      "id": 4,
                      "emergency_no": 1,
                      "water_bottle": 0,
                      "charging_point": 0,
                      "usb_port": 1,
                      "blankets": 1,
                      "pillows": 0,
                      "reading_light": 1,
                      "toilet": 0,
                      "snacks": 0,
                      "tour_guide": 1,
                      "cctv": 1,
                      "status": 0,
                      "created_date": "2023-12-14T10:16:49.143244Z",
                      "updated_date": "2023-12-14T10:16:49.143337Z",
                      "bus": 4
                  }
              ],
              "user": 1
          },
          {
              "id": 3,
              "bus_name": "Kallada",
              "plate_no": "KL10AZ7887",
              "bus_type": 1,
              "bus_ac": 0,
              "amenities_data": [
                  {
                      "id": 3,
                      "emergency_no": 1,
                      "water_bottle": 0,
                      "charging_point": 0,
                      "usb_port": 1,
                      "blankets": 0,
                      "pillows": 0,
                      "reading_light": 0,
                      "toilet": 0,
                      "snacks": 1,
                      "tour_guide": 0,
                      "cctv": 1,
                      "status": 0,
                      "created_date": "2023-12-14T10:15:57.785127Z",
                      "updated_date": "2023-12-14T10:15:57.785166Z",
                      "bus": 3
                  }
              ],
              "user": 1
          },
          {
              "id": 2,
              "bus_name": "Jabbar",
              "plate_no": "KL08AZ7889",
              "bus_type": 0,
              "bus_ac": 0,
              "user": 1
          },
          {
              "id": 1,
              "bus_name": "Sera",
              "plate_no": "KL08AZ7887",
              "bus_type": 0,
              "bus_ac": 0,
              "amenities_data": [
                  {
                      "id": 1,
                      "emergency_no": 0,
                      "water_bottle": 1,
                      "charging_point": 1,
                      "usb_port": 1,
                      "blankets": 1,
                      "pillows": 1,
                      "reading_light": 1,
                      "toilet": 0,
                      "snacks": 1,
                      "tour_guide": 1,
                      "cctv": 1,
                      "status": 0,
                      "created_date": "2023-12-14T07:09:58.316833Z",
                      "updated_date": "2023-12-29T05:51:36.868706Z",
                      "bus": 1
                  }
              ],
              "user": 1
          }
      ]
  }

  const deleteData = {
    "id": 9,
    "bus_name": "Shamida",
    "plate_no": "KL08AC9799",
    "bus_type": 0,
    "bus_ac": 0,
    "amenities_data": [
        {
            "id": 9,
            "emergency_no": 0,
            "water_bottle": 0,
            "charging_point": 1,
            "usb_port": 1,
            "blankets": 1,
            "pillows": 0,
            "reading_light": 0,
            "toilet": 0,
            "snacks": 0,
            "tour_guide": 0,
            "cctv": 1,
            "status": 0,
            "created_date": "2024-01-10T11:31:00.093031Z",
            "updated_date": "2024-01-10T11:31:00.093055Z",
            "bus": 9
        }
    ],
    "user": 1
}

    mock.onGet(`bus-owner/view-bus/?page=${1}`).reply(200, data);
    mock.onPut(`bus-owner/delete-bus/${99}/`).reply(404, deleteData);

    render(
      <MemoryRouter>
        <ViewBus />
      </MemoryRouter>
    );
    await new Promise(resolve => setTimeout(resolve, 2000));


    const deleteButtons = screen.getAllByTestId("delete-button");
    fireEvent.click(deleteButtons[0]);

});
});
