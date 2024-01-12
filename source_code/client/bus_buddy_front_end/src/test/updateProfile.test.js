import React from "react";
import { render,fireEvent,screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UpdateProfile from "../components/admin/profile/UpdateProfile";
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});
jest.mock("../../../assets/images/adminProfileView.png")
describe("update profile", () => {
  test("render update profile", () => {
    render(
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    );
  });

  // test("enter details", () => {
  //   mock.onGet(`adminstrator/update-profile/`).reply(200, data);
  //   render(
  //     <BrowserRouter>
  //       <UpdateProfile />
  //     </BrowserRouter>
  //   );
  //   fireEvent.change(screen.getByTestId("first-name"), {
  //       target: { value: "Dev" },
  //     });
  
  //     fireEvent.change(screen.getByTestId("last-name"), {
  //       target: { value: "V A" },
  //     });
  //     fireEvent.change(screen.getByTestId("email"), {
  //       target: { value: "Enter email" },
  //     });

  //     fireEvent.change(screen.getByTestId("phone"), {
  //       target: { value: "Phone Number" },
  //     });
  //     fireEvent.click(screen.getByTestId("update-profile"));
  
  // });
});
