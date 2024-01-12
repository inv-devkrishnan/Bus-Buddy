import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ReviewHistory from "../components/User/ReviewHistory";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("ReviewHistory component", () => {
  it("renders data", () => {
    const data = {
      "page_size": 5,
      "total_objects": 5,
      "total_pages": 1,
      "current_page_number": 1,
      "has_next": false,
      "next": null,
      "has_previous": false,
      "previous": null,
      "results": [
          {
              "id": 5,
              "review_title": "Bad",
              "review_body": "Very Bad",
              "rating": 3,
              "updated_time": "2023-12-20T10:51:29.958783Z",
              "trip_start_date": "2023-12-24",
              "trip_end_date": "2023-12-25",
              "trip_start_time": "22:00:00",
              "trip_end_time": "03:50:00",
              "bus_name": "Tara",
              "route_start": "Ernakulam",
              "route_end": "Thiruvananthapuram",
              "pick_up": "vytilla",
              "drop_off": "trivandrum",
              "booking": "BK4YR20237589"
          },
          {
              "id": 15,
              "review_title": "Bad",
              "review_body": "Very Bad",
              "rating": 1,
              "updated_time": "2023-12-20T10:51:29.958783Z",
              "trip_start_date": "2023-12-24",
              "trip_end_date": "2023-12-25",
              "trip_start_time": "22:00:00",
              "trip_end_time": "03:50:00",
              "bus_name": "Tara",
              "route_start": "Ernakulam",
              "route_end": "Thiruvananthapuram",
              "pick_up": "vytilla",
              "drop_off": "trivandrum",
              "booking": "BK4YR20237589"
          },
          {
              "id": 2,
              "review_title": "goody",
              "review_body": "good good",
              "rating": 3,
              "updated_time": "2023-12-20T10:51:29.958783Z",
              "trip_start_date": "2023-12-24",
              "trip_end_date": "2023-12-25",
              "trip_start_time": "22:00:00",
              "trip_end_time": "03:50:00",
              "bus_name": "Tara",
              "route_start": "Ernakulam",
              "route_end": "Thiruvananthapuram",
              "pick_up": "vytilla",
              "drop_off": "trivandrum",
              "booking": "BK4YR20237589"
          },
          {
              "id": 3,
              "review_title": "Nice",
              "review_body": "Sweet",
              "rating": 4,
              "updated_time": "2023-12-20T10:51:29.958783Z",
              "trip_start_date": "2023-12-24",
              "trip_end_date": "2023-12-25",
              "trip_start_time": "22:00:00",
              "trip_end_time": "03:50:00",
              "bus_name": "Tara",
              "route_start": "Ernakulam",
              "route_end": "Thiruvananthapuram",
              "pick_up": "vytilla",
              "drop_off": "trivandrum",
              "booking": "BK4YR20237589"
          },
          {
              "id": 4,
              "review_title": "Yuk",
              "review_body": "Very Bad",
              "rating": 2,
              "updated_time": "2023-12-20T10:51:29.958783Z",
              "trip_start_date": "2023-12-24",
              "trip_end_date": "2023-12-25",
              "trip_start_time": "22:00:00",
              "trip_end_time": "03:50:00",
              "bus_name": "Tara",
              "route_start": "Ernakulam",
              "route_end": "Thiruvananthapuram",
              "pick_up": "vytilla",
              "drop_off": "trivandrum",
              "booking": "BK4YR20237589"
          }
      ]
  }
    mock.onGet(`user/review-history/?page=${1}&&ordering=`).reply(200, data);

    render(<ReviewHistory />);
  });

  it("catch error", () => {
    mock.onGet(`user/review-history/?page=${1}&&ordering=`).reply(400);

    render(<ReviewHistory />);
  });

  it("sorting", () => {
    render(<ReviewHistory />);

    const sortDrop = screen.getByText("Sort by");
    fireEvent.click(sortDrop);

    const sortAsc = screen.getByText("Ascending order");
    fireEvent.click(sortAsc);
    fireEvent.click(sortDrop);
    const sortDesc = screen.getByText("Descending order");
    fireEvent.click(sortDesc);
    fireEvent.click(sortDrop);
    const sortEmpty = screen.getByText("Clear sorting");
    fireEvent.click(sortEmpty);
  });
});
