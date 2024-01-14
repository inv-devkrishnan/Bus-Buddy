import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RouteDetails from "../components/RouteDetails";

describe("RouteDetails component", () => {
    const routeData = {
      start_point: "",
      end_point: "",
      via: "",
      distance: "",
      duration: "",
      travel_fare:"",
      location:"",
    };

  it("renders component", () => {
    render(<RouteDetails routeData={routeData} />);
  });
});
