import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserBookingHistory from "../components/User/UserBookingHistory";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("UserBookingHistory component", () => {
  it("renders card", () => {
    render(<UserBookingHistory />);

    const showButton = screen.getByText("Show");
    fireEvent.click(showButton);
    // dropdown button options
    const cancelled = screen.getByText("Cancelled");
    fireEvent.click(cancelled);
    const booked = screen.getByText("Booked");
    fireEvent.click(booked);
    const completed = screen.getByText("Completed");
    fireEvent.click(completed);
    const all = screen.getByText("All");
    fireEvent.click(all);
  });

  it("getting booking data", async () => {
    const data = {
      page_size: 5,
      total_objects: 1,
      total_pages: 1,
      current_page_number: 1,
      has_next: false,
      next: null,
      has_previous: false,
      previous: null,
      results: [
        {
          id: 15,
          user: {
            id: 4,
            last_login: null,
            first_name: "Farsana",
            last_name: "KA",
            email: "farsanahassis01@gmail.com",
            password:
              "pbkdf2_sha256$600000$XPqWjZKeLFbvX83Q4TFcGb$bId//t/isbLDjeX5c07NJXIVrS8jazCyvQLVZlAN4yQ=",
            phone: "8927949460",
            company_name: null,
            aadhaar_no: null,
            msme_no: null,
            extra_charges: null,
            role: 2,
            status: 0,
            account_provider: 0,
            user_details_status: 0,
            created_date: "2023-12-04T06:28:26.043476Z",
            updated_date: "2023-12-20T07:07:10.478486Z",
          },
          trip: {
            id: 4,
            start_date: "2024-01-31",
            end_date: "2024-02-01",
            start_time: "22:00:00",
            end_time: "22:05:00",
            status: 0,
            created_date: "2023-11-29T07:02:32.924154Z",
            updated_date: "2023-11-29T07:02:32.924171Z",
            bus: {
              id: 1,
              bus_name: "Tara",
              plate_no: "KL1213125",
              status: 0,
              bus_seat_type: 0,
              bus_type: 2,
              bus_ac: 0,
              bus_details_status: 2,
              created_date: "2023-11-29T04:18:59.713676Z",
              updated_date: "2023-11-29T06:05:20.444656Z",
              user: {
                id: 2,
                last_login: null,
                first_name: "Raj",
                last_name: "Shekar",
                email: "rajshekar@gmail.com",
                password:
                  "pbkdf2_sha256$600000$SE1J0rvC5d8fjB3JiVZR8r$AQDj9W5vBnU/pLY3TmkjNGrtG9PyogcN7/tCjRtB+sM=",
                phone: "9787878544",
                company_name: "Shekar travels",
                aadhaar_no: "534534534564",
                msme_no: "UDYAN-125-147851",
                extra_charges: 18.0,
                role: 3,
                status: 0,
                account_provider: 0,
                user_details_status: 0,
                created_date: "2023-11-29T04:00:10.174202Z",
                updated_date: "2023-12-04T06:08:51.382677Z",
              },
            },
            route: {
              id: 2,
              via: "Kottayam",
              distance: "310.600",
              duration: "5.100",
              travel_fare: "3428.000",
              status: 0,
              created_date: "2023-11-29T06:57:52.601063Z",
              updated_date: "2023-11-29T06:57:52.601084Z",
              user: {
                id: 2,
                last_login: null,
                first_name: "Raj",
                last_name: "Shekar",
                email: "rajshekar@gmail.com",
                password:
                  "pbkdf2_sha256$600000$SE1J0rvC5d8fjB3JiVZR8r$AQDj9W5vBnU/pLY3TmkjNGrtG9PyogcN7/tCjRtB+sM=",
                phone: "9787878544",
                company_name: "Shekar travels",
                aadhaar_no: "534534534564",
                msme_no: "UDYAN-125-147851",
                extra_charges: 18.0,
                role: 3,
                status: 0,
                account_provider: 0,
                user_details_status: 0,
                created_date: "2023-11-29T04:00:10.174202Z",
                updated_date: "2023-12-04T06:08:51.382677Z",
              },
              start_point: {
                id: 2,
                location_name: "Ernakulam",
                created_time: "2023-11-29T12:00:00Z",
                updated_time: "2023-11-29T12:00:00Z",
              },
              end_point: {
                id: 10,
                location_name: "Thiruvananthapuram",
                created_time: "2023-11-29T12:00:00Z",
                updated_time: "2023-11-29T12:00:00Z",
              },
            },
            user: {
              id: 2,
              last_login: null,
              first_name: "Raj",
              last_name: "Shekar",
              email: "rajshekar@gmail.com",
              password:
                "pbkdf2_sha256$600000$SE1J0rvC5d8fjB3JiVZR8r$AQDj9W5vBnU/pLY3TmkjNGrtG9PyogcN7/tCjRtB+sM=",
              phone: "9787878544",
              company_name: "Shekar travels",
              aadhaar_no: "534534534564",
              msme_no: "UDYAN-125-147851",
              extra_charges: 18.0,
              role: 3,
              status: 0,
              account_provider: 0,
              user_details_status: 0,
              created_date: "2023-11-29T04:00:10.174202Z",
              updated_date: "2023-12-04T06:08:51.382677Z",
            },
          },
          pick_up: {
            id: 6,
            bus_stop: "vytilla",
            arrival_time: "22:00:00",
            landmark: "vytilla hub",
            status: 0,
            route: {
              id: 2,
              via: "Kottayam",
              distance: "310.600",
              duration: "5.100",
              travel_fare: "3428.000",
              status: 0,
              created_date: "2023-11-29T06:57:52.601063Z",
              updated_date: "2023-11-29T06:57:52.601084Z",
              user: {
                id: 2,
                last_login: null,
                first_name: "Raj",
                last_name: "Shekar",
                email: "rajshekar@gmail.com",
                password:
                  "pbkdf2_sha256$600000$SE1J0rvC5d8fjB3JiVZR8r$AQDj9W5vBnU/pLY3TmkjNGrtG9PyogcN7/tCjRtB+sM=",
                phone: "9787878544",
                company_name: "Shekar travels",
                aadhaar_no: "534534534564",
                msme_no: "UDYAN-125-147851",
                extra_charges: 18.0,
                role: 3,
                status: 0,
                account_provider: 0,
                user_details_status: 0,
                created_date: "2023-11-29T04:00:10.174202Z",
                updated_date: "2023-12-04T06:08:51.382677Z",
              },
              start_point: {
                id: 2,
                location_name: "Ernakulam",
                created_time: "2023-11-29T12:00:00Z",
                updated_time: "2023-11-29T12:00:00Z",
              },
              end_point: {
                id: 10,
                location_name: "Thiruvananthapuram",
                created_time: "2023-11-29T12:00:00Z",
                updated_time: "2023-11-29T12:00:00Z",
              },
            },
            start_stop_location: {
              id: 5,
              seq_id: 1,
              arrival_time: "22:00:00",
              arrival_date_offset: 0,
              departure_time: "22:05:00",
              departure_date_offset: 0,
              status: 0,
              location: {
                id: 2,
                location_name: "Ernakulam",
                created_time: "2023-11-29T12:00:00Z",
                updated_time: "2023-11-29T12:00:00Z",
              },
              route: {
                id: 2,
                via: "Kottayam",
                distance: "310.600",
                duration: "5.100",
                travel_fare: "3428.000",
                status: 0,
                created_date: "2023-11-29T06:57:52.601063Z",
                updated_date: "2023-11-29T06:57:52.601084Z",
                user: 2,
                start_point: 2,
                end_point: 10,
              },
            },
          },
          drop_off: {
            id: 10,
            bus_stop: "trivandrum",
            arrival_time: "03:50:00",
            landmark: "thiruvananthapuram nagarasabha",
            status: 0,
            route: {
              id: 2,
              via: "Kottayam",
              distance: "310.600",
              duration: "5.100",
              travel_fare: "3428.000",
              status: 0,
              created_date: "2023-11-29T06:57:52.601063Z",
              updated_date: "2023-11-29T06:57:52.601084Z",
              user: {
                id: 2,
                last_login: null,
                first_name: "Raj",
                last_name: "Shekar",
                email: "rajshekar@gmail.com",
                password:
                  "pbkdf2_sha256$600000$SE1J0rvC5d8fjB3JiVZR8r$AQDj9W5vBnU/pLY3TmkjNGrtG9PyogcN7/tCjRtB+sM=",
                phone: "9787878544",
                company_name: "Shekar travels",
                aadhaar_no: "534534534564",
                msme_no: "UDYAN-125-147851",
                extra_charges: 18.0,
                role: 3,
                status: 0,
                account_provider: 0,
                user_details_status: 0,
                created_date: "2023-11-29T04:00:10.174202Z",
                updated_date: "2023-12-04T06:08:51.382677Z",
              },
              start_point: {
                id: 2,
                location_name: "Ernakulam",
                created_time: "2023-11-29T12:00:00Z",
                updated_time: "2023-11-29T12:00:00Z",
              },
              end_point: {
                id: 10,
                location_name: "Thiruvananthapuram",
                created_time: "2023-11-29T12:00:00Z",
                updated_time: "2023-11-29T12:00:00Z",
              },
            },
            start_stop_location: {
              id: 8,
              seq_id: 4,
              arrival_time: "03:50:00",
              arrival_date_offset: 1,
              departure_time: "03:55:00",
              departure_date_offset: 1,
              status: 0,
              location: {
                id: 10,
                location_name: "Thiruvananthapuram",
                created_time: "2023-11-29T12:00:00Z",
                updated_time: "2023-11-29T12:00:00Z",
              },
              route: {
                id: 2,
                via: "Kottayam",
                distance: "310.600",
                duration: "5.100",
                travel_fare: "3428.000",
                status: 0,
                created_date: "2023-11-29T06:57:52.601063Z",
                updated_date: "2023-11-29T06:57:52.601084Z",
                user: 2,
                start_point: 2,
                end_point: 10,
              },
            },
          },
          status: 99,
          total_amount: "4340.040",
          booking_id: "BK4YR2024978",
          created_date: "2024-01-15T04:15:07.815578Z",
          booked_seats: [
            {
              id: 22,
              trip: {
                id: 4,
                start_date: "2024-01-31",
                end_date: "2024-02-01",
                start_time: "22:00:00",
                end_time: "22:05:00",
                status: 0,
                created_date: "2023-11-29T07:02:32.924154Z",
                updated_date: "2023-11-29T07:02:32.924171Z",
                bus: 1,
                route: 2,
                user: 2,
              },
              traveller_name: "jvhgvhgv",
              traveller_dob: "2024-01-10",
              traveller_gender: 1,
              seat: {
                id: 1,
                seat_number: "a1",
                seat_ui_order: 11,
                seat_type: 1,
                deck: 0,
                seat_cost: "250.000",
                status: 0,
                created_date: "2023-11-29T04:22:36.565612Z",
                updated_date: "2023-11-29T04:22:36.565641Z",
                bus: 1,
              },
            },
          ],
          review: [],
        },
      ],
    };

    render(<UserBookingHistory />);

    const showButton = screen.getByText("Show");
    fireEvent.click(showButton);

    const all = screen.getByText("All");
    fireEvent.click(all);
    mock.onGet(`user/booking-history?page=${1}&&status=""`).reply(200, data);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });
});
