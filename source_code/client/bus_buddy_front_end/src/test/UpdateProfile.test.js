import React from "react";
import { render, fireEvent, screen, waitFor} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UpdateProfile from "../components/admin/profile/UpdateProfile";
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";

let mock;
let data = {
  first_name: "dev",
  last_name: "krishnan",
  email: "dev@123.com",
  phone: "1233553435"
}
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

  test("enter details", async () => {
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-profile')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId("first-name"), {
      target: { value: "Dev" },
    });

    fireEvent.change(screen.getByTestId("last-name"), {
      target: { value: "V A" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "Enter email" },
    });

    fireEvent.change(screen.getByTestId("phone"), {
      target: { value: "Phone Number" },
    });
    fireEvent.click(screen.getByTestId("update-profile"));
  });
  test("enter details blank", async () => {
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-profile')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId("first-name"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByTestId("last-name"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "" },
    });

    fireEvent.change(screen.getByTestId("phone"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByTestId("update-profile"));
    jest.advanceTimersByTime(400);
  });

  test("enter details invalid", async () => {
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-profile')).toBeInTheDocument();
    });
    fireEvent.change(screen.getByTestId("first-name"), {
      target: { value: "de@4 546" },
    });

    fireEvent.change(screen.getByTestId("last-name"), {
      target: { value: "D3g y66" },
    });
    fireEvent.change(screen.getByTestId("email"), {
      target: { value: "dev@gmail.com" },
    });

    fireEvent.change(screen.getByTestId("phone"), {
      target: { value: "fsddfsgdt" },
    }); fireEvent.change(screen.getByTestId("phone"), {
      target: { value: "940043122" },
    });
    fireEvent.click(screen.getByTestId("update-profile"));
  });

  test("platform charge", async () => {
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Platform Charges"));
    fireEvent.change(screen.getByPlaceholderText("Enter platform charges"), {
      target: { value: "10" },
    });
    fireEvent.click(screen.getByText("Update"));
    mock.onPut(`account/platformcharges/`).reply(200, "done");
  });

  test("platform charge null", async () => {
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Platform Charges"));
    fireEvent.change(screen.getByPlaceholderText("Enter platform charges"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Update"));
    mock.onPut(`account/platformcharges/`).reply(400,{error:"404"});
  });

  test("platform charge not number", async () => {
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Platform Charges"));
    fireEvent.change(screen.getByPlaceholderText("Enter platform charges"), {
      target: { value: "sdf" },
    });
    fireEvent.click(screen.getByText("Update"));

  });
  test("platform charge not in range", async () => {
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Platform Charges"));
    fireEvent.change(screen.getByPlaceholderText("Enter platform charges"), {
      target: { value: "500" },
    });
    fireEvent.click(screen.getByText("Update"));
  });
  test("platform charge close dialog", async () => {
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('update-profile')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Platform Charges"));
    fireEvent.click(screen.getByText("Close"));
  });
});
