import React from "react";
import { render,screen,fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import ViewTrips from "../components/BusOwnerUi/MyTrips/ViewTrips"
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("View Trips component", () => {
  it("renders component",async () => {
    const data ={
      "page_size": 15,
      "total_objects": 9,
      "total_pages": 1,
      "current_page_number": 1,
      "has_next": false,
      "next": null,
      "has_previous": false,
      "previous": null,
      "results": [
          {
              "start_point_name": "Alappuzha",
              "end_point_name": "Thiruvananthapuram",
              "id": 30,
              "start_date": "2024-02-02",
              "end_date": "2024-02-02",
              "bus_name": "Jabbar",
              "bus": 2,
              "route": 2
          },
          {
              "start_point_name": "Ernakulam",
              "end_point_name": "Thrissur",
              "id": 29,
              "start_date": "2024-01-18",
              "end_date": "2024-01-18",
              "bus_name": "Kallada",
              "bus": 3,
              "route": 1
          },
          {
              "start_point_name": "Ernakulam",
              "end_point_name": "Thrissur",
              "id": 28,
              "start_date": "2024-01-17",
              "end_date": "2024-01-17",
              "bus_name": "Kallada",
              "bus": 3,
              "route": 1
          },
          {
              "start_point_name": "Ernakulam",
              "end_point_name": "Thrissur",
              "id": 27,
              "start_date": "2024-01-16",
              "end_date": "2024-01-16",
              "bus_name": "Kallada",
              "bus": 3,
              "route": 1
          },
          {
              "start_point_name": "Palakkad",
              "end_point_name": "Kozhikode",
              "id": 26,
              "start_date": "2024-01-23",
              "end_date": "2024-01-23",
              "bus_name": "Jabbar",
              "bus": 2,
              "route": 3
          },
          {
              "start_point_name": "Palakkad",
              "end_point_name": "Kozhikode",
              "id": 25,
              "start_date": "2024-01-16",
              "end_date": "2024-01-16",
              "bus_name": "Jabbar",
              "bus": 2,
              "route": 3
          },
          {
              "start_point_name": "Ernakulam",
              "end_point_name": "Thrissur",
              "id": 22,
              "start_date": "2024-01-29",
              "end_date": "2024-01-30",
              "bus_name": "Sera",
              "bus": 1,
              "route": 1
          },
          {
              "start_point_name": "Ernakulam",
              "end_point_name": "Thrissur",
              "id": 21,
              "start_date": "2024-01-22",
              "end_date": "2024-01-23",
              "bus_name": "Sera",
              "bus": 1,
              "route": 1
          },
          {
              "start_point_name": "Ernakulam",
              "end_point_name": "Thrissur",
              "id": 20,
              "start_date": "2024-01-15",
              "end_date": "2024-01-16",
              "bus_name": "Sera",
              "bus": 1,
              "route": 1
          }
      ]
  }
  const deleteData = {
    "start_point_name": "Ernakulam",
    "end_point_name": "Thrissur",
    "id": 20,
    "start_date": "2024-01-15",
    "end_date": "2024-01-16",
    "bus_name": "Sera",
    "bus": 1,
    "route": 1
}

mock.onGet(`bus-owner/view-trip/?page=${1}&search=${""}&ordering=${3}`).reply(200, data);
mock.onPut(`bus-owner/delete-trip/${20}/`).reply(200, deleteData);
    render(
        <MemoryRouter>
          <ViewTrips />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));

      const deleteButtons = screen.getAllByTestId("delete-button");
      fireEvent.click(deleteButtons[0]);

      const updateButtons = screen.getAllByTestId("update-button");
      fireEvent.click(updateButtons[0]);

      const accordianButtons = screen.getAllByTestId("accordian-button");
      fireEvent.click(accordianButtons[0]);

      const filterOrder = screen.getAllByText("Order By");
      fireEvent.click(filterOrder[0]);

      const filterRecent = screen.getAllByText("Most Recently Added");
      fireEvent.click(filterRecent[0]);

      const filterLeastRecent = screen.getAllByText("Least Recently Added");
      fireEvent.click(filterLeastRecent[0]);

      const filterDesc = screen.getAllByText("Trips in descending by date");
      fireEvent.click(filterDesc[0]);

      const filterAscend = screen.getAllByText("Trips in ascending by date");
      fireEvent.click(filterAscend[0]);

      const modalButton = screen.getByText("Yes, delete it!");
      fireEvent.click(modalButton);

      const stopButton = screen.getAllByTestId("route-button");
      fireEvent.click(stopButton[0]);

  
  });
});