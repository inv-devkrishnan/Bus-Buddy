import React from "react";
import { render,fireEvent,screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProfileView from "../components/admin/profile/ProfileView";

jest.mock("../../../assets/images/adminProfileView.png")
describe("update profile", () => {
    test("render update profile", () => {
      render(
        <BrowserRouter>
          <ProfileView/>
        </BrowserRouter>
      );
    });
});