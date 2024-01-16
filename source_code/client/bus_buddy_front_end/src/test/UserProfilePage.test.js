import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserProfilePage from "../components/User/UserProfilePage";

jest.mock("../assets/update.png");

describe("UserProfilePage component", () => {
  it("renders card", () => {
    render(<UserProfilePage setUserName={jest.fn()} />);
  });
});
