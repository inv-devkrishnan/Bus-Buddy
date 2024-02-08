import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ComplaintResponse from "../components/User/ComplaintResponse";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("ComplaintResponse component", () => {
  it("renders component", () => {
    const data = [
      {
        id: 9,
        complaint_title: "Bad air conditioning",
        complaint_body: "Your bus had bad air conditioning",
        complaint_image: null,
        response: "Please provide details",
        status: 0,
        created_date: "2023-12-18",
        updated_date: "2023-12-18",
        user: 4,
        complaint_for: 2,
      },
    ];
    mock.onGet(`user/list-complaints/?ordering=&&search=`).reply(200, data);
    render(
      <ComplaintResponse complaintData={[]} setComplaintData={jest.fn()} />
    );
  });

  it("search and sort onclick", () => {
    render(
      <ComplaintResponse complaintData={[]} setComplaintData={jest.fn()} />
    );
    const searchField = screen.getByPlaceholderText("Enter text");
    fireEvent.change(searchField, { target: { value: "adghgj" } });

    const searchButton = screen.getByText("Search");
    fireEvent.click(searchButton);

    const sortDrop = screen.getByText("Sort by date");
    fireEvent.click(sortDrop);

    const sortNew = screen.getByText("Newest to oldest");
    fireEvent.click(sortNew);
    fireEvent.click(sortDrop);
    const sortOld = screen.getByText("Oldest to newest");
    fireEvent.click(sortOld);
    fireEvent.click(sortDrop);
    const sortEmpty = screen.getByText("Clear sorting");
    fireEvent.click(sortEmpty);
  });
});
