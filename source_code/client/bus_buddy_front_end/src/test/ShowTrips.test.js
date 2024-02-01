import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import ShowTrips from "../components/User/view_trips/ShowTrips";
import MockAdapter from "axios-mock-adapter";
import { openAxiosApi } from "../utils/axiosApi";
let mock;

beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
});

afterEach(() => {
  mock.restore();
});

let data = {
  total_pages: 1,
  total_items: 1,
  items_per_page: 5,
  current_page: 1,
  has_previous: false,
  has_next: false,
  data: [
    {
      route: 10,
      start_location_arrival_time: "08:00:00",
      end_location_arrival_time: "10:15:00",
      start_location_arrival_date: "2024-01-19",
      end_location_arrival_date: "2024-01-19",
      via: "Thrissur",
      travel_fare: 200.0,
      trip: 178,
      bus_name: "NiviBus",
      bus_owner:2,
      bus: 7,
      company_name: "Nivil Travels",
      route_cost: 100.0,
      gst: 2.0,
      amenities: {
        emergency_no: 1,
        water_bottle: 1,
        charging_point: 1,
        usb_port: 1,
        blankets: 1,
        bus_owner: 2,
        pillows: 1,
        reading_light: 0,
        toilet: 0,
        snacks: 0,
        tour_guide: 0,
        cctv: 1,
      },
    },
  ],
};
let review_data = {
  reviews: [
    {
      id: 4,
      review_title: "bad trip",
      review_body: "text",
      rating: 2,
      created_date: "2024-01-01T10:54:40.914909Z",
      updated_time: "2024-01-05T10:54:40.914939Z",
      user_id: {
        first_name: "Devkrishnan",
      },
    },
    {
      id: 5,
      review_title: "worst trip",
      review_body: "text",
      rating: 1,
      created_date: "2024-01-05T10:54:40.914909Z",
      updated_time: "2024-01-05T10:54:40.914939Z",
      user_id: {
        first_name: "Devkrishnan",
      },
    },
    {
      id: 6,
      review_title: "worst ever  trip",
      review_body: "text",
      rating: 0,
      created_date: "2024-01-05T10:54:40.914909Z",
      updated_time: "2024-01-05T10:54:40.914939Z",
      user_id: {
        first_name: "Devkrishnan",
      },
    },
    {
      id: 7,
      review_title: "nice df  trip",
      review_body: "text",
      rating: 3,
      created_date: "2024-01-05T10:54:40.914909Z",
      updated_time: "2024-01-05T10:54:40.914939Z",
      user_id: {
        first_name: "Devkrishnan",
      },
    },
    {
      id: 8,
      review_title: "nice df dsg trip",
      review_body: "text",
      rating: 4,
      created_date: "2024-01-05T10:54:40.914909Z",
      updated_time: "2024-01-05T10:54:40.914939Z",
      user_id: {
        first_name: "Devkrishnan",
      },
    },
    {
      id: 9,
      review_title: "nice df dsg trip",
      review_body: "text",
      rating: 5,
      created_date: "2024-01-05T10:54:40.914909Z",
      updated_time: "2024-01-05T10:54:40.914939Z",
      user_id: {
        first_name: "Devkrishnan",
      },
    },
    {
      id: 10,
      review_title: "nice df fsdsg trip",
      review_body: "text",
      rating: -1,
      created_date: "2024-01-05T10:54:40.914909Z",
      updated_time: "2024-01-05T10:54:40.914939Z",
      user_id: {
        first_name: "Devkrishnan",
      },
    },
  ],
  pages: 3,
  current_page: 2,
  has_previous: true,
  has_next: true,
  total_count: 7,
};

jest.mock("../pages/ViewSeatDetails");
describe("show Trips", () => {
  test("trip render and amenities", async () => {
    mock
      .onGet(
        `user/view-trips/?start=undefined&end=undefined&date=undefined&page=1&seat-type=-1&bus-type=-1&bus-ac=-1`
      )
      .reply(200, data);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <ShowTrips />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    fireEvent.click(screen.getByText("View Amenities"));
    fireEvent.click(screen.getByText("Close"));
  });

  test("trip render fail", () => {
    mock
      .onGet(
        `user/view-trips/?start=undefined&end=undefined&date=undefined&page=1&seat-type=-1&bus-type=-1&bus-ac=-1`
      )
      .reply(400, data);
    render(
      <BrowserRouter>
        <ShowTrips />
      </BrowserRouter>
    );
  });

  test("trip render with clear filter", async () => {
    mock
      .onGet(
        `user/view-trips/?start=undefined&end=undefined&date=undefined&page=1&seat-type=-1&bus-type=-1&bus-ac=-1`
      )
      .reply(200, data);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <ShowTrips />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    fireEvent.click(screen.getByText("Clear All"));
  });

  test("trip render with sleeper", async () => {
    mock
      .onGet(
        `user/view-trips/?start=undefined&end=undefined&date=undefined&page=1&seat-type=-1&bus-type=-1&bus-ac=-1`
      )
      .reply(200, data);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <ShowTrips />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const seater = screen.getByTestId("seater");
    const sleeper = screen.getByTestId("sleeper");
    const bothSleeper = screen.getByTestId("both-sleeper");
    fireEvent.click(seater);
    fireEvent.click(sleeper);
    fireEvent.click(bothSleeper);
    fireEvent.click(screen.getByTestId("low-floor"));
    fireEvent.click(screen.getByTestId("multi-axle"));
    fireEvent.click(screen.getByTestId("both-bus"));
    fireEvent.click(screen.getByTestId("yes"));
    fireEvent.click(screen.getByTestId("no"));
  });

  test("trip render and view seats", async () => {
    mock
      .onGet(
        `user/view-trips/?start=undefined&end=undefined&date=undefined&page=1&seat-type=-1&bus-type=-1&bus-ac=-1`
      )
      .reply(200, data);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <ShowTrips />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    fireEvent.click(screen.getByText("Select Seats"));
    fireEvent.click(screen.getByText("Close"));
  });

  test("Ctrip render and show reviews", async () => {
    mock
      .onGet(
        `user/view-trips/?start=undefined&end=undefined&date=undefined&page=1&seat-type=-1&bus-type=-1&bus-ac=-1`
      )
      .reply(200, data);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <ShowTrips />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    mock
      .onGet(`user/view-reviews/?user_id=2&page=1`)
      .reply(200, review_data);
    fireEvent.click(screen.getByText("View Reviews"));
    await new Promise((resolve) => setTimeout(resolve, 2000));
    screen.getByTestId("list-review").scrollTo = jest.fn();
    fireEvent.click(screen.getByRole('button', { name: 'page 2' }));
    fireEvent.click(screen.getByText("Close"));
  });

  test("A trip render and show reviews critical fail", async () => {
    mock
      .onGet(
        `user/view-trips/?start=undefined&end=undefined&date=undefined&page=1&seat-type=-1&bus-type=-1&bus-ac=-1`
      )
      .reply(200, data);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <ShowTrips />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    mock
      .onGet(`user/view-reviews/?user_id=2&page=1`)
      .reply(400, review_data);
    fireEvent.click(screen.getByText("View Reviews"));
  });

  test("B trip render and show reviews fail", async () => {
    mock
      .onGet(
        `user/view-trips/?start=undefined&end=undefined&date=undefined&page=1&seat-type=-1&bus-type=-1&bus-ac=-1`
      )
      .reply(200, data);
    render(
      <SeatContextProvider>
        <AddSeatContextProvider>
          <UserContextProvider>
            <BrowserRouter>
              <ShowTrips />
            </BrowserRouter>
          </UserContextProvider>
        </AddSeatContextProvider>
      </SeatContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    mock.onGet(`user/view-reviews/?user_id=2&page=1`).reply(200, {
      error_message: "invalid query param",
      error_code: "D1006",
    });
    fireEvent.click(screen.getByText("View Reviews"));
  });
});
