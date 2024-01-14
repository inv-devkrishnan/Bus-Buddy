import React from "react";
import { render } from "@testing-library/react";
import { NavbarLayout } from "./NavBarLayout";
import { BrowserRouter} from "react-router-dom";

test("navbar layout", () => {
  render(
    <BrowserRouter>
      <NavbarLayout />
    </BrowserRouter>
  );
});
