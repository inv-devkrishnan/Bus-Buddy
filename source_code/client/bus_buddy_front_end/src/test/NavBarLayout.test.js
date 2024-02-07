import React from "react";
import { render } from "@testing-library/react";
import { NavbarLayout } from "../components/common/navbar/NavBarLayout";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "../components/User/UserContext";

test("navbar layout", () => {
  render(
    <UserContextProvider>
      <BrowserRouter>
        <NavbarLayout />
      </BrowserRouter>
    </UserContextProvider>
  );
});
