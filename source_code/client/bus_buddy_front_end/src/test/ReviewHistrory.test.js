import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ReviewHistory from "../components/User/ReviewHistory";

describe("ReviewHistory component", () => {
  it("renders component", () => {
    render(<ReviewHistory />);
  });
});
