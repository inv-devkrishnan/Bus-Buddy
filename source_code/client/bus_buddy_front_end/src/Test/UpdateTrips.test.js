import React from "react";
import { render,screen,fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import UpdateTrips from "../components/BusOwnerUi/MyTrips/UpdateTrips"
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: jest.fn(),
    useLocation: jest.fn().mockReturnValue({
      state: 22, // Add the state object with the id property
    }),
  }));

  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axiosApi);
  });
  
  afterEach(() => {
    mock.restore();
  });
  
describe("Update trips component", () => {
  it("renders component",async () => {
    const data = {
        "id": 22,
        "bus": 1,
        "route": 1,
        "user": 1,
        "start_date": "2024-01-29",
        "end_date": "2024-01-30",
        "start_time": "09:00",
        "end_time": "10:45",
        "status": 0,
        "created_date": "2023-12-29T04:07:30.925466Z",
        "updated_date": "2023-12-29T05:51:47.236231Z"
    }
    mock.onGet(`bus-owner/update-trip/${22}/`).reply(200, data);
    const busData = {
        "page_size": 15,
        "total_objects": 6,
        "total_pages": 1,
        "current_page_number": 1,
        "has_next": false,
        "next": null,
        "has_previous": false,
        "previous": null,
        "results": [
            {
                "id": 11,
                "bus_name": "DEV",
                "plate_no": "KL10AX9865",
                "bus_type": 0,
                "bus_ac": 0,
                "amenities_data": [
                    {
                        "id": 11,
                        "emergency_no": 0,
                        "water_bottle": 1,
                        "charging_point": 0,
                        "usb_port": 0,
                        "blankets": 0,
                        "pillows": 0,
                        "reading_light": 0,
                        "toilet": 0,
                        "snacks": 1,
                        "tour_guide": 0,
                        "cctv": 1,
                        "status": 0,
                        "created_date": "2024-01-17T10:44:33.503404Z",
                        "updated_date": "2024-01-17T10:44:33.503497Z",
                        "bus": 11
                    }
                ],
                "user": 1
            },
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
                "amenities_data": [
                    {
                        "id": 2,
                        "emergency_no": 0,
                        "water_bottle": 0,
                        "charging_point": 0,
                        "usb_port": 0,
                        "blankets": 1,
                        "pillows": 1,
                        "reading_light": 0,
                        "toilet": 1,
                        "snacks": 0,
                        "tour_guide": 1,
                        "cctv": 1,
                        "status": 0,
                        "created_date": "2023-12-14T10:13:34.463915Z",
                        "updated_date": "2023-12-14T10:13:34.463953Z",
                        "bus": 2
                    }
                ],
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
    mock.onGet(`bus-owner/get-valid-bus/`).reply(200, busData);
    const routeData = {
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
    mock.onGet("bus-owner/view-routes/").reply(200, routeData);
    const availableBus = [
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
        },
        {
            "id": 2,
            "bus_name": "Jabbar",
            "plate_no": "KL08AZ7889",
            "bus_type": 0,
            "bus_ac": 0,
            "amenities_data": [
                {
                    "id": 2,
                    "emergency_no": 0,
                    "water_bottle": 0,
                    "charging_point": 0,
                    "usb_port": 0,
                    "blankets": 1,
                    "pillows": 1,
                    "reading_light": 0,
                    "toilet": 1,
                    "snacks": 0,
                    "tour_guide": 1,
                    "cctv": 1,
                    "status": 0,
                    "created_date": "2023-12-14T10:13:34.463915Z",
                    "updated_date": "2023-12-14T10:13:34.463953Z",
                    "bus": 2
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
        }
    ]
    mock.onGet(`bus-owner/view-available-bus/?start=${"2025-01-18"}&end=${"2025-01-18"}`).reply(200, availableBus);
    const updateData = {
        "bus": 11,
        "route": 3,
        "user": 1,
        "start_date": "2024-01-26",
        "end_date": "2024-01-26",
        "start_time": "08:00:00",
        "end_time": "18:00:00",
        "status": 0,
        "created_date": "2023-11-02T10:00:00Z",
        "updated_date": "2023-11-02T12:00:00Z"
    }
    mock.onGet(`bus-owner/update-trip/${11}/`).reply(200, updateData);

    render(
        <MemoryRouter>
          <UpdateTrips />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
      const startDateField = screen.getByLabelText("Start Date:");
      fireEvent.change(startDateField,{target :{value:"2025-01-18"}});

      const endDateField = screen.getByLabelText("End Date :");
      fireEvent.change(endDateField,{target:{value :"2025-01-18"}})

      const serachButton = screen.getByText("search");
      fireEvent.click(serachButton);

      const busSelect = screen.getByTestId("bus-select");
      fireEvent.change(busSelect,{target:{value:"1"}});

      const routeSelect = screen.getByTestId("route-select");
      fireEvent.change(routeSelect,{target:{value:"3"}});

      const addButton = screen.getByText("Update");
      fireEvent.click(addButton);



  
  });
});