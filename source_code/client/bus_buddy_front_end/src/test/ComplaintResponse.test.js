import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ComplaintResponse from "../components/User/ComplaintResponse";

describe("ComplaintResponse component", () => {
  it("renders component", () => {
    render(<ComplaintResponse />);
  });

  it("search onclick", () => {
    render(<ComplaintResponse />);
    
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
