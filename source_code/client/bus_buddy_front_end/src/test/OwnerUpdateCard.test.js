import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import OwnerUpdateForm from "../components/OwnerUpdateCard";

describe("OwnerUpdateCard component", () => {
  it("renders card", () => {
    render(<OwnerUpdateForm />);
  });
});
