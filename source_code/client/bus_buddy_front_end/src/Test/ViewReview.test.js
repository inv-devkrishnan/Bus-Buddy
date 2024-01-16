import React from "react";
import { fireEvent, render,screen, } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { MemoryRouter } from 'react-router-dom';
import ViewReviews from "../components/BusOwnerUi/MyReviews/ViewReviews"
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("ReviewHistory component", () => {
  it("renders component",async () => {
    const data ={
      "page_size": 15,
      "total_objects": 1,
      "total_pages": 1,
      "current_page_number": 1,
      "has_next": false,
      "next": null,
      "has_previous": false,
      "previous": null,
      "results": [
          {
              "id": 1,
              "review_title": "good",
              "review_body": "We took the bus service from Vienna to Prague as well as from Prague to Berlin. Bus service was excellent. Customer service was great. Buses were clean and comfy. Free hot beverages were very good as well. Really enjoyed their great service.",
              "rating": 5,
              "created_date": "2023-12-16T08:00:28.972983Z",
              "updated_time": "2023-12-16T08:00:28.972983Z",
              "user_id": {
                  "id": 3,
                  "last_login": null,
                  "first_name": "Antony",
                  "last_name": "Jose ",
                  "email": "antony.jose@innovaturelabs.com",
                  "password": "!RhwIKRDwAq9GpAQsqFMPEaEBOONmaOEroOcUuwy4",
                  "phone": null,
                  "company_name": null,
                  "aadhaar_no": null,
                  "msme_no": null,
                  "extra_charges": 3.0,
                  "role": 2,
                  "status": 0,
                  "account_provider": 1,
                  "user_details_status": 1,
                  "created_date": "2023-12-15T07:57:45.657868Z",
                  "updated_date": "2023-12-26T12:31:42.516514Z"
              },
              "trip_id": {
                  "id": 2,
                  "start_date": "2023-12-15",
                  "end_date": "2023-12-15",
                  "start_time": "09:00:00",
                  "end_time": "10:45:00",
                  "status": 1,
                  "created_date": "2023-12-15T07:19:39.081037Z",
                  "updated_date": "2023-12-15T07:19:39.081104Z",
                  "bus": 5,
                  "route": 1,
                  "user": 1
              },
              "booking_id": {
                  "id": 1,
                  "status": 0,
                  "total_amount": "253.000",
                  "booking_id": "BK3YR20238463",
                  "created_date": "2023-12-15T08:00:28.972983Z",
                  "updated_date": "2023-12-15T08:00:28.973007Z",
                  "user": 3,
                  "trip": 2,
                  "pick_up": 2,
                  "drop_off": 4
              },
              "review_for": {
                  "id": 1,
                  "last_login": null,
                  "first_name": "Antony",
                  "last_name": "Kollannur",
                  "email": "antony@gmail.com",
                  "password": "pbkdf2_sha256$600000$OEaBqgy4onR9cocC9n7r7m$uynzE3bUvTW0xQob3A8dyddpPHxQX765nGZJpmaizXI=",
                  "phone": "8589102525",
                  "company_name": "Kollannur Travels",
                  "aadhaar_no": "654974994549",
                  "msme_no": "54644",
                  "extra_charges": 5.0,
                  "role": 3,
                  "status": 0,
                  "account_provider": 0,
                  "user_details_status": 0,
                  "created_date": "2023-12-14T05:29:43.453433Z",
                  "updated_date": "2023-12-14T05:34:03.061115Z"
              }
          }
      ]
  }

  mock.onGet(`http://localhost:8000/bus-owner/view-reviews/?page=${1}`).reply(200, data);
    render(
        <MemoryRouter>
          <ViewReviews />
        </MemoryRouter>
      );
      await new Promise(resolve => setTimeout(resolve, 2000));

      const accordianButton = screen.getAllByTestId("accordian-button");
      fireEvent.click(accordianButton[0]);

  });
});