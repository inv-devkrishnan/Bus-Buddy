import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserBookingHistory from "../components/User/UserBookingHistory";

describe("UserBookingHistory component", () => {
  it("renders card", () => {
    render(<UserBookingHistory />);
  });
});
