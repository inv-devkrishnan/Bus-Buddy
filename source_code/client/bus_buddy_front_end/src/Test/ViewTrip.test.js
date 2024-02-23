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

      const yesDelete = screen.getAllByText("Yes, delete it!");
      fireEvent.click(yesDelete[0]);

      const filterRecent = screen.getAllByText("Most Recently Added");
      fireEvent.click(filterRecent[0]);

      const filterLeastRecent = screen.getAllByText("Least Recently Added");
      fireEvent.click(filterLeastRecent[0]);

      const filterDesc = screen.getAllByText("Trips in descending by date");
      fireEvent.click(filterDesc[0]);

      const filterAscend = screen.getAllByText("Trips in ascending by date");
      fireEvent.click(filterAscend[0]);

      const stopButton = screen.getAllByTestId("route-button");
      fireEvent.click(stopButton[0]);

      const passengerButton = screen.getAllByText("Passenger List");
      fireEvent.click(passengerButton[0]);

  
  });

  it("renders component no delete",async () => {
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
const routeData = {
    "data": [
        {
            "bus_stop": "churam",
            "arrival_time": "11:15",
            "landmark": "churam",
            "start_stop_location": {
                "id": 7,
                "seq_id": 1,
                "arrival_time": "11:00:00",
                "arrival_date_offset": 0,
                "departure_time": "11:40:00",
                "departure_date_offset": 2,
                "status": 0,
                "location": {
                    "id": 14,
                    "location_name": "Wayanad",
                    "created_time": "2023-12-15T12:27:54Z",
                    "updated_time": "2023-12-15T12:27:54Z"
                },
                "route": {
                    "id": 5,
                    "via": "vadakara",
                    "distance": "120.000",
                    "duration": "2.000",
                    "travel_fare": "130.000",
                    "status": 0,
                    "created_date": "2023-12-20T05:48:42.680684Z",
                    "updated_date": "2023-12-20T05:48:42.680705Z",
                    "user": 4,
                    "start_point": 14,
                    "end_point": 8
                }
            },
            "route": {
                "id": 5,
                "via": "vadakara",
                "distance": "120.000",
                "duration": "2.000",
                "travel_fare": "130.000",
                "status": 0,
                "created_date": "2023-12-20T05:48:42.680684Z",
                "updated_date": "2023-12-20T05:48:42.680705Z",
                "user": {
                    "id": 4,
                    "last_login": null,
                    "first_name": "Franscis",
                    "last_name": "Siju",
                    "email": "Francis@gmail.com",
                    "password": "pbkdf2_sha256$600000$U6njGz2alkO5RJ1K4S9JS8$4Li8MDG2txyK9p8vkaQeagpPmWNSRTDvfRAFXvPIv8w=",
                    "phone": "8745124510",
                    "company_name": "Moyalan Travels",
                    "aadhaar_no": "651074994549",
                    "msme_no": "51044",
                    "extra_charges": 4.0,
                    "role": 3,
                    "status": 0,
                    "account_provider": 0,
                    "user_details_status": 0,
                    "created_date": "2023-12-20T05:15:15.370302Z",
                    "updated_date": "2023-12-20T05:37:22.211034Z"
                },
                "start_point": {
                    "id": 14,
                    "location_name": "Wayanad",
                    "created_time": "2023-12-15T12:27:54Z",
                    "updated_time": "2023-12-15T12:27:54Z"
                },
                "end_point": {
                    "id": 8,
                    "location_name": "Kozhikode",
                    "created_time": "2023-12-15T12:27:54Z",
                    "updated_time": "2023-12-15T12:27:54Z"
                }
            }
        },
        {
            "bus_stop": "beach",
            "arrival_time": "12:50",
            "landmark": "beach",
            "start_stop_location": {
                "id": 8,
                "seq_id": 2,
                "arrival_time": "12:40:00",
                "arrival_date_offset": 0,
                "departure_time": "13:00:00",
                "departure_date_offset": 2,
                "status": 0,
                "location": {
                    "id": 8,
                    "location_name": "Kozhikode",
                    "created_time": "2023-12-15T12:27:54Z",
                    "updated_time": "2023-12-15T12:27:54Z"
                },
                "route": {
                    "id": 5,
                    "via": "vadakara",
                    "distance": "120.000",
                    "duration": "2.000",
                    "travel_fare": "130.000",
                    "status": 0,
                    "created_date": "2023-12-20T05:48:42.680684Z",
                    "updated_date": "2023-12-20T05:48:42.680705Z",
                    "user": 4,
                    "start_point": 14,
                    "end_point": 8
                }
            },
            "route": {
                "id": 5,
                "via": "vadakara",
                "distance": "120.000",
                "duration": "2.000",
                "travel_fare": "130.000",
                "status": 0,
                "created_date": "2023-12-20T05:48:42.680684Z",
                "updated_date": "2023-12-20T05:48:42.680705Z",
                "user": {
                    "id": 4,
                    "last_login": null,
                    "first_name": "Franscis",
                    "last_name": "Siju",
                    "email": "Francis@gmail.com",
                    "password": "pbkdf2_sha256$600000$U6njGz2alkO5RJ1K4S9JS8$4Li8MDG2txyK9p8vkaQeagpPmWNSRTDvfRAFXvPIv8w=",
                    "phone": "8745124510",
                    "company_name": "Moyalan Travels",
                    "aadhaar_no": "651074994549",
                    "msme_no": "51044",
                    "extra_charges": 4.0,
                    "role": 3,
                    "status": 0,
                    "account_provider": 0,
                    "user_details_status": 0,
                    "created_date": "2023-12-20T05:15:15.370302Z",
                    "updated_date": "2023-12-20T05:37:22.211034Z"
                },
                "start_point": {
                    "id": 14,
                    "location_name": "Wayanad",
                    "created_time": "2023-12-15T12:27:54Z",
                    "updated_time": "2023-12-15T12:27:54Z"
                },
                "end_point": {
                    "id": 8,
                    "location_name": "Kozhikode",
                    "created_time": "2023-12-15T12:27:54Z",
                    "updated_time": "2023-12-15T12:27:54Z"
                }
            }
        }
    ]
}

mock.onGet(`bus-owner/view-trip/?page=${1}&search=${""}&ordering=${3}`).reply(200, data);
mock.onPut(`bus-owner/delete-trip/${20}/`).reply(200, deleteData);
mock.onGet(`bus-owner/pick-and-drop-stops/${5}/`).reply(400, routeData);
    await new Promise(resolve => setTimeout(resolve, 2000));
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

      const modalButton = screen.getByText("Yes, delete it!");
      fireEvent.click(modalButton);

      const stopButton = screen.getAllByTestId("route-button");
      fireEvent.click(stopButton[0]);

      const passengerButton = screen.getAllByText("Passenger List");
      fireEvent.click(passengerButton[0]);

  
  });
});