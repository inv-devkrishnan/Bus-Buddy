import React from "react";
import { render,screen,fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import ViewRoutes from "../components/BusOwnerUi/MyRoutes/ViewRoutes"
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("View Route component", () => {
  it("renders component",async () => {
    const data = {
      "page_size": 15,
      "total_objects": 3,
      "total_pages": 1,
      "current_page_number": 1,
      "has_next": false,
      "next": null,
      "has_previous": false,
      "previous": null,
      "results": [
          {
              "start_point_name": "Palakkad",
              "end_point_name": "Kozhikode",
              "via": "kajniram",
              "distance": "149.990",
              "travel_fare": "170.000",
              "duration": "2.000",
              "id": 3,
              "user": 1,
              "location": [
                  {
                      "id": 5,
                      "seq_id": 1,
                      "arrival_time": "12:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "13:00:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 10,
                      "route": 3
                  },
                  {
                      "id": 6,
                      "seq_id": 2,
                      "arrival_time": "13:15:00",
                      "arrival_date_offset": 0,
                      "departure_time": "14:00:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 8,
                      "route": 3
                  }
              ]
          },
          {
              "start_point_name": "Alappuzha",
              "end_point_name": "Thiruvananthapuram",
              "via": "pathnamthitta",
              "distance": "150.000",
              "travel_fare": "1900.000",
              "duration": "3.500",
              "id": 2,
              "user": 1,
              "location": [
                  {
                      "id": 3,
                      "seq_id": 1,
                      "arrival_time": "11:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "11:50:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 1,
                      "route": 2
                  },
                  {
                      "id": 4,
                      "seq_id": 2,
                      "arrival_time": "14:30:00",
                      "arrival_date_offset": 0,
                      "departure_time": "15:10:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 12,
                      "route": 2
                  }
              ]
          },
          {
              "start_point_name": "Ernakulam",
              "end_point_name": "Thrissur",
              "via": "koratty",
              "distance": "80.000",
              "travel_fare": "112.000",
              "duration": "1.700",
              "id": 1,
              "user": 1,
              "location": [
                  {
                      "id": 1,
                      "seq_id": 1,
                      "arrival_time": "09:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "09:45:00",
                      "departure_date_offset": 0,
                      "status": 99,
                      "location": 2,
                      "route": 1
                  },
                  {
                      "id": 2,
                      "seq_id": 2,
                      "arrival_time": "10:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "10:45:00",
                      "departure_date_offset": 0,
                      "status": 99,
                      "location": 13,
                      "route": 1
                  }
              ]
          }
      ]
  }
  const deleteData = {
    "start_point_name": "Palakkad",
    "end_point_name": "Kozhikode",
    "via": "kajniram",
    "distance": "149.990",
    "travel_fare": "170.000",
    "duration": "2.000",
    "id": 3,
    "user": 1,
    "location": [
        {
            "id": 5,
            "seq_id": 1,
            "arrival_time": "12:00:00",
            "arrival_date_offset": 0,
            "departure_time": "13:00:00",
            "departure_date_offset": 0,
            "status": 0,
            "location": 10,
            "route": 3
        },
        {
            "id": 6,
            "seq_id": 2,
            "arrival_time": "13:15:00",
            "arrival_date_offset": 0,
            "departure_time": "14:00:00",
            "departure_date_offset": 0,
            "status": 0,
            "location": 8,
            "route": 3
        }
    ]
}
  mock.onGet(`bus-owner/view-routes/?page=${1}&search=${""}&ordering=${""}`).reply(200, data);
  mock.onPut(`bus-owner/delete-routes/${3}/`).reply(200, deleteData);
 
    render(
        <MemoryRouter>
          <ViewRoutes />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
    

    const deleteButtons = screen.getAllByTestId("delete-button");
    fireEvent.click(deleteButtons[0]);

    const accordianButtons = screen.getAllByTestId("accordian-button");
    fireEvent.click(accordianButtons[0]);

    const modalButton = screen.getByText("Cancel");
    fireEvent.click(modalButton);
  
  });

  it("renders component unsuccessful",async () => {
    const data = {
      "page_size": 15,
      "total_objects": 3,
      "total_pages": 1,
      "current_page_number": 1,
      "has_next": false,
      "next": null,
      "has_previous": false,
      "previous": null,
      "results": [
          {
              "start_point_name": "Palakkad",
              "end_point_name": "Kozhikode",
              "via": "kajniram",
              "distance": "149.990",
              "travel_fare": "170.000",
              "duration": "2.000",
              "id": 3,
              "user": 1,
              "location": [
                  {
                      "id": 5,
                      "seq_id": 1,
                      "arrival_time": "12:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "13:00:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 10,
                      "route": 3
                  },
                  {
                      "id": 6,
                      "seq_id": 2,
                      "arrival_time": "13:15:00",
                      "arrival_date_offset": 0,
                      "departure_time": "14:00:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 8,
                      "route": 3
                  }
              ]
          },
          {
              "start_point_name": "Alappuzha",
              "end_point_name": "Thiruvananthapuram",
              "via": "pathnamthitta",
              "distance": "150.000",
              "travel_fare": "1900.000",
              "duration": "3.500",
              "id": 2,
              "user": 1,
              "location": [
                  {
                      "id": 3,
                      "seq_id": 1,
                      "arrival_time": "11:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "11:50:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 1,
                      "route": 2
                  },
                  {
                      "id": 4,
                      "seq_id": 2,
                      "arrival_time": "14:30:00",
                      "arrival_date_offset": 0,
                      "departure_time": "15:10:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 12,
                      "route": 2
                  }
              ]
          },
          {
              "start_point_name": "Ernakulam",
              "end_point_name": "Thrissur",
              "via": "koratty",
              "distance": "80.000",
              "travel_fare": "112.000",
              "duration": "1.700",
              "id": 1,
              "user": 1,
              "location": [
                  {
                      "id": 1,
                      "seq_id": 1,
                      "arrival_time": "09:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "09:45:00",
                      "departure_date_offset": 0,
                      "status": 99,
                      "location": 2,
                      "route": 1
                  },
                  {
                      "id": 2,
                      "seq_id": 2,
                      "arrival_time": "10:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "10:45:00",
                      "departure_date_offset": 0,
                      "status": 99,
                      "location": 13,
                      "route": 1
                  }
              ]
          }
      ]
  }
  const deleteData = {
    "start_point_name": "Palakkad",
    "end_point_name": "Kozhikode",
    "via": "kajniram",
    "distance": "149.990",
    "travel_fare": "170.000",
    "duration": "2.000",
    "id": 3,
    "user": 1,
    "location": [
        {
            "id": 5,
            "seq_id": 1,
            "arrival_time": "12:00:00",
            "arrival_date_offset": 0,
            "departure_time": "13:00:00",
            "departure_date_offset": 0,
            "status": 0,
            "location": 10,
            "route": 3
        },
        {
            "id": 6,
            "seq_id": 2,
            "arrival_time": "13:15:00",
            "arrival_date_offset": 0,
            "departure_time": "14:00:00",
            "departure_date_offset": 0,
            "status": 0,
            "location": 8,
            "route": 3
        }
    ]
}
  mock.onGet(`bus-owner/view-routes/?page=${1}&search=${""}&ordering=${""}`).reply(200, data);
  mock.onPut(`bus-owner/delete-routes/${5256}/`).reply(404, deleteData);
 
    render(
        <MemoryRouter>
          <ViewRoutes />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
    

    const deleteButtons = screen.getAllByTestId("delete-button");
    fireEvent.click(deleteButtons[0]);

});

it("renders component modal success",async () => {
    const data = {
      "page_size": 15,
      "total_objects": 3,
      "total_pages": 1,
      "current_page_number": 1,
      "has_next": false,
      "next": null,
      "has_previous": false,
      "previous": null,
      "results": [
          {
              "start_point_name": "Palakkad",
              "end_point_name": "Kozhikode",
              "via": "kajniram",
              "distance": "149.990",
              "travel_fare": "170.000",
              "duration": "2.000",
              "id": 3,
              "user": 1,
              "location": [
                  {
                      "id": 5,
                      "seq_id": 1,
                      "arrival_time": "12:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "13:00:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 10,
                      "route": 3
                  },
                  {
                      "id": 6,
                      "seq_id": 2,
                      "arrival_time": "13:15:00",
                      "arrival_date_offset": 0,
                      "departure_time": "14:00:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 8,
                      "route": 3
                  }
              ]
          },
          {
              "start_point_name": "Alappuzha",
              "end_point_name": "Thiruvananthapuram",
              "via": "pathnamthitta",
              "distance": "150.000",
              "travel_fare": "1900.000",
              "duration": "3.500",
              "id": 2,
              "user": 1,
              "location": [
                  {
                      "id": 3,
                      "seq_id": 1,
                      "arrival_time": "11:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "11:50:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 1,
                      "route": 2
                  },
                  {
                      "id": 4,
                      "seq_id": 2,
                      "arrival_time": "14:30:00",
                      "arrival_date_offset": 0,
                      "departure_time": "15:10:00",
                      "departure_date_offset": 0,
                      "status": 0,
                      "location": 12,
                      "route": 2
                  }
              ]
          },
          {
              "start_point_name": "Ernakulam",
              "end_point_name": "Thrissur",
              "via": "koratty",
              "distance": "80.000",
              "travel_fare": "112.000",
              "duration": "1.700",
              "id": 1,
              "user": 1,
              "location": [
                  {
                      "id": 1,
                      "seq_id": 1,
                      "arrival_time": "09:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "09:45:00",
                      "departure_date_offset": 0,
                      "status": 99,
                      "location": 2,
                      "route": 1
                  },
                  {
                      "id": 2,
                      "seq_id": 2,
                      "arrival_time": "10:00:00",
                      "arrival_date_offset": 0,
                      "departure_time": "10:45:00",
                      "departure_date_offset": 0,
                      "status": 99,
                      "location": 13,
                      "route": 1
                  }
              ]
          }
      ]
  }
  const deleteData = {
    "start_point_name": "Palakkad",
    "end_point_name": "Kozhikode",
    "via": "kajniram",
    "distance": "149.990",
    "travel_fare": "170.000",
    "duration": "2.000",
    "id": 3,
    "user": 1,
    "location": [
        {
            "id": 5,
            "seq_id": 1,
            "arrival_time": "12:00:00",
            "arrival_date_offset": 0,
            "departure_time": "13:00:00",
            "departure_date_offset": 0,
            "status": 0,
            "location": 10,
            "route": 3
        },
        {
            "id": 6,
            "seq_id": 2,
            "arrival_time": "13:15:00",
            "arrival_date_offset": 0,
            "departure_time": "14:00:00",
            "departure_date_offset": 0,
            "status": 0,
            "location": 8,
            "route": 3
        }
    ]
}
  mock.onGet(`bus-owner/view-routes/?page=${1}&search=${""}&ordering=${""}`).reply(200, data);
  mock.onPut(`bus-owner/delete-routes/${3}/`).reply(200, deleteData);
 
    render(
        <MemoryRouter>
          <ViewRoutes />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
    

    const deleteButtons = screen.getAllByTestId("delete-button");
    fireEvent.click(deleteButtons[0]);

    const accordianButtons = screen.getAllByTestId("accordian-button");
    fireEvent.click(accordianButtons[0]);
    
    const modalButton = screen.getByText("Yes, delete it!");
    fireEvent.click(modalButton);
  
  });

});