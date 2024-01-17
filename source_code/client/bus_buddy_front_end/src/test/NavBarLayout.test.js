import React from "react";
import { render } from "@testing-library/react";
import { NavbarLayout } from "../components/common/navbar/NavBarLayout";
import { BrowserRouter} from "react-router-dom";

test("navbar layout", () => {
  render(
    <BrowserRouter>
      <NavbarLayout />
    </BrowserRouter>
  );
});
