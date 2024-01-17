import React from "react";
import { useNavigate } from "react-router-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import MockAdapter from "axios-mock-adapter";
import { axiosApi, openAxiosApi } from "../utils/axiosApi";
import AddRouteCard from "../components/AddRouteCard";

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));
jest.mock("../assets/route.jpg");

let mock;
let mockClosedApi;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
  mockClosedApi = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
  mockClosedApi.restore();
});

const data = [
  {
    id: 1,
    location_name: "Trivandrum",
  },
  {
    id: 2,
    location_name: "Pathanamthitta",
  },
  {
    id: 3,
    location_name: "Kottayam",
  },
  {
    id: 4,
    location_name: "Kollam",
  },
  {
    id: 5,
    location_name: "Kozhikode",
  },
  {
    id: 6,
    location_name: "Ernakulam",
  },
  {
    id: 7,
    location_name: "Thrissur",
  },
  {
    id: 8,
    location_name: "Palakad",
  },
];

const renderWtihLocationData = () => {
  localStorage.setItem(
    "stopLocationList",
    '[{"seq_id":1,"location":1,"arrival_time":"10:00","arrival_date_offset":"0","departure_time":"11:00","departure_date_offset":"0","pick_and_drop":[{"bus_stop":"tvm center","location":1,"arrival_time":"10:05","landmark":"dfsdfsd","status":0}]},{"seq_id":2,"location":2,"arrival_time":"12:00","arrival_date_offset":"0","departure_time":"13:00","departure_date_offset":"0","pick_and_drop":[{"bus_stop":"pathanam cenetrer","location":1,"arrival_time":"12:15","landmark":"fsdf","status":0}]},{"seq_id":3,"location":3,"arrival_time":"09:00","arrival_date_offset":"1","departure_time":"13:00","departure_date_offset":"1","pick_and_drop":[{"bus_stop":"kotayam stop","location":1,"arrival_time":"09:15","landmark":"dfs","status":0}]}]'
  );
  render(<AddRouteCard />);
};

const addLocationAndStops = async () =>
{
  mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "10:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    fireEvent.change(screen.getByPlaceholderText("Stop Name"), {
      target: { value: "defd" },
    });
    fireEvent.change(screen.getByPlaceholderText("Landmark"), {
      target: { value: "dasdasd" },
    });
    fireEvent.change(screen.getByTestId("stop-time"), {
      target: { value: "10:15:00" },
    });
    fireEvent.click(screen.getByText("Add Stop"));
    fireEvent.change(screen.getByPlaceholderText("Stop Name"), {
      target: { value: "defd" },
    });
    fireEvent.change(screen.getByPlaceholderText("Landmark"), {
      target: { value: "dasdasd" },
    });
    fireEvent.change(screen.getByTestId("stop-time"), {
      target: { value: "10:20:00" },
    });
    fireEvent.click(screen.getByText("Add Stop"));
}
describe("AddRouteCard component", () => {
  useNavigate.mockImplementation(() => jest.fn());

  it("add stop and location valid", async() => {
    await addLocationAndStops();
  });

    it("add stop and location invalid stop time", async() => {
    await addLocationAndStops();
    fireEvent.change(screen.getByPlaceholderText("Stop Name"), {
      target: { value: "defd" },
    });
    fireEvent.change(screen.getByPlaceholderText("Landmark"), {
      target: { value: "dasdasd" },
    });
    fireEvent.change(screen.getByTestId("stop-time"), {
      target: { value: "10:18:00" },
    });
    fireEvent.click(screen.getByText("Add Stop"));
  });

  it("add stop and with different offset location", async() => {
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "10:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    fireEvent.change(screen.getByPlaceholderText("Stop Name"), {
      target: { value: "defd" },
    });
    fireEvent.change(screen.getByPlaceholderText("Landmark"), {
      target: { value: "dasdasd" },
    });
    fireEvent.change(screen.getByTestId("stop-time"), {
      target: { value: "10:15:00" },
    });
    fireEvent.click(screen.getByText("Add Stop"));
    fireEvent.change(screen.getByPlaceholderText("Stop Name"), {
      target: { value: "defd" },
    });
    fireEvent.change(screen.getByPlaceholderText("Landmark"), {
      target: { value: "dasdasd" },
    });
    fireEvent.change(screen.getByTestId("stop-time"), {
      target: { value: "10:20:00" },
    });
    fireEvent.click(screen.getByText("Add Stop"));
  });

   it("add stop and with different offset location invalid case", async() => {
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "10:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    fireEvent.change(screen.getByPlaceholderText("Stop Name"), {
      target: { value: "defd" },
    });
    fireEvent.change(screen.getByPlaceholderText("Landmark"), {
      target: { value: "dasdasd" },
    });
    fireEvent.change(screen.getByTestId("stop-time"), {
      target: { value: "10:15:00" },
    });
    fireEvent.click(screen.getByText("Add Stop"));
    fireEvent.change(screen.getByPlaceholderText("Stop Name"), {
      target: { value: "defd" },
    });
    fireEvent.change(screen.getByPlaceholderText("Landmark"), {
      target: { value: "dasdasd" },
    });
    fireEvent.change(screen.getByTestId("stop-time"), {
      target: { value: "10:05:00" },
    });
    fireEvent.click(screen.getByText("Add Stop"));
  });

  it("add stop and location  invalid time", async() => {
   
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "12:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    
  });

  it("add stop and location  invalid offset", async() => {
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "10:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "1" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
  });

  it("add stop and location  already added", async() => {
    localStorage.setItem(
      "stopLocationList",
      '[{"seq_id":1,"location":1,"arrival_time":"10:00","arrival_date_offset":"0","departure_time":"11:00","departure_date_offset":"0","pick_and_drop":[{"bus_stop":"tvm center","location":1,"arrival_time":"10:05","landmark":"dfsdfsd","status":0}]},{"seq_id":2,"location":2,"arrival_time":"12:00","arrival_date_offset":"0","departure_time":"13:00","departure_date_offset":"0","pick_and_drop":[{"bus_stop":"pathanam cenetrer","location":1,"arrival_time":"12:15","landmark":"fsdf","status":0}]},{"seq_id":3,"location":3,"arrival_time":"09:00","arrival_date_offset":"1","departure_time":"13:00","departure_date_offset":"1","pick_and_drop":[{"bus_stop":"kotayam stop","location":1,"arrival_time":"09:15","landmark":"dfs","status":0}]}]'
    );
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "10:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    localStorage.clear();
  });

  

  it("add stop and location  invalid blank", async() => {
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
  });


  it("add stop blank", async() => {
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "10:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    fireEvent.change(screen.getByPlaceholderText("Stop Name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByPlaceholderText("Landmark"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("stop-time"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Add Stop"));
  });

  it("add stop invalid stop time", async() => {
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "10:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    fireEvent.change(screen.getByPlaceholderText("Stop Name"), {
      target: { value: "defd" },
    });
    fireEvent.change(screen.getByPlaceholderText("Landmark"), {
      target: { value: "dasdasd" },
    });
    fireEvent.change(screen.getByTestId("stop-time"), {
      target: { value: "11:15:00" },
    });
    fireEvent.click(screen.getByText("Add Stop"));
  });


  it("save changes without stop", async() => {
    mock.onGet(`get-location-data/`).reply(200, data);
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Add Location"));
    await new Promise(resolve => setTimeout(resolve, 2000)); // to load locations
    fireEvent.change(screen.getByTestId("arrival-time"), {
      target: { value: "10:00:00" },
    });
    fireEvent.change(screen.getByTestId("arrival-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId("depature-time"), {
      target: { value: "11:00:00" },
    });
    fireEvent.change(screen.getByTestId("depature-date-offset"), {
      target: { value: "0" },
    });
    fireEvent.click(screen.getByTestId("add-location-box"));
    fireEvent.click(screen.getByText("Save Changes"));
  });

  it("add stop and location valid save", async() => {
    await addLocationAndStops();
    fireEvent.click(screen.getByText("Save Changes"));
  });

   

  it("submit blank data", () => {
    render(<AddRouteCard />);
    fireEvent.click(screen.getByText("Submit"));
  });

  it("submit valid data", () => {
    renderWtihLocationData();
    fireEvent.change(screen.getByPlaceholderText("Enter the location"), {
      target: { value: "thrissur" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter the total time"), {
      target: { value: "2.5" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter the total distance"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter the travel fare"), {
      target: { value: "500" },
    });
    fireEvent.click(screen.getByText("Submit"));
    mockClosedApi.onPost(`bus-owner/add-routes/`).reply(200, { data: "dfs" });
  });

  it("submit invalid data", () => {
    render(<AddRouteCard />);
    fireEvent.change(screen.getByPlaceholderText("Enter the location"), {
      target: { value: "thrissur" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter the total time"), {
      target: { value: "2.5" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter the total distance"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter the travel fare"), {
      target: { value: "500" },
    });
    fireEvent.click(screen.getByText("Submit"));
  });
  it("reset location data", () => {
    renderWtihLocationData();
    fireEvent.click(screen.getByText("Reset"));
  });
});
