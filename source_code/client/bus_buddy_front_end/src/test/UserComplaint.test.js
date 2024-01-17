import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserComplaint from "../components/User/UserComplaint";

describe("UserComplaint component", () => {
  it("renders card", () => {
    render(<UserComplaint />);
  });
});
