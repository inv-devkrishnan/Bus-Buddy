import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UpdateProfile from "../components/admin/profile/UpdateProfile";
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";
import { UserContextProvider } from "../components/User/UserContext";

let mock;
let data = {
  first_name: "dev",
  last_name: "krishnan",
  email: "dev@123.com",
  phone: "1233553435",
};
beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});
jest.mock("../../../assets/images/adminProfileView.png");

const submitForm = (firstName, lastName, email, phone) => {
  fireEvent.change(screen.getByTestId("first-name"), {
    target: { value: firstName },
  });

  fireEvent.change(screen.getByTestId("last-name"), {
    target: { value: lastName },
  });
  fireEvent.change(screen.getByTestId("email"), {
    target: { value: email },
  });

  fireEvent.change(screen.getByTestId("phone"), {
    target: { value: phone },
  });
  fireEvent.click(screen.getByTestId("update-profile"));
};

const renderForm = async () => {
  mock.onGet(`adminstrator/update-profile/`).reply(200, data);
  render(
    <UserContextProvider>
      <BrowserRouter>
        <UpdateProfile />
      </BrowserRouter>
    </UserContextProvider>
  );
  await waitFor(() => {
    expect(screen.getByTestId("update-profile")).toBeInTheDocument();
  });
};

const submitPlatformCharges = (value) => {
  fireEvent.click(screen.getByText("Platform Charges"));
  fireEvent.change(screen.getByPlaceholderText("Enter platform charges"), {
    target: { value: value },
  });
  fireEvent.click(screen.getByText("Update"));
};
describe("update profile", () => {
  test("render update profile", () => {
    render(
      <UserContextProvider>
        <BrowserRouter>
          <UpdateProfile />
        </BrowserRouter>
      </UserContextProvider>
    );
  });

  test("test01 enter details", async () => {
    mock.onPut(`adminstrator/update-profile/`).reply(200, data);
    render(
      <UserContextProvider>
        <BrowserRouter>
          <UpdateProfile />
        </BrowserRouter>
      </UserContextProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("update-profile")).toBeInTheDocument();
    });
    submitForm("Dev", "VA", "dev@gmail.com", "9400531221");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  test("test02 enter details fail", async () => {
    mock.onPut(`adminstrator/update-profile/`).reply(400, data);
    render(
      <UserContextProvider>
        <BrowserRouter>
          <UpdateProfile />
        </BrowserRouter>
      </UserContextProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("update-profile")).toBeInTheDocument();
    });
    submitForm("Dev", "VA", "dev@gmail.com", "9400531221");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
  test("enter details blank", async () => {
    await renderForm();
    submitForm("", "", "", "");
    jest.advanceTimersByTime(400);
  });

  test("enter details invalid", async () => {
    await renderForm();
    submitForm("d@et ev", "dfg3 5 2", "45 fd", "fde");
    fireEvent.click(screen.getByTestId("update-profile"));
  });

  test("phone number not 10 digit", async () => {
    await renderForm();
    submitForm("d432@et ev4", "dfg233 5 2", "42345 fd342", "423");
    fireEvent.click(screen.getByTestId("update-profile"));
  });

  test("platform charge", async () => {
    await renderForm();

    submitPlatformCharges(10);
    mock.onPut(`account/platformcharges/`).reply(200, "done");
  });

  test("platform charge failed", async () => {
    await renderForm();

    submitPlatformCharges(10);
    mock.onPut(`account/platformcharges/`).reply(400);
  });

  test("platform charge null", async () => {
    await renderForm();

    submitPlatformCharges(null);
    mock.onPut(`account/platformcharges/`).reply(400, { error: "404" });
  });

  test("platform charge not number", async () => {
    await renderForm();
    submitPlatformCharges("sdf");
  });
  test("platform charge not in range", async () => {
    await renderForm();

    submitPlatformCharges("500");
  });
  test("platform charge close dialog", async () => {
    mock.onGet(`adminstrator/update-profile/`).reply(200, data);
    render(
      <UserContextProvider>
        <BrowserRouter>
          <UpdateProfile />
        </BrowserRouter>
      </UserContextProvider>
    );
    await waitFor(() => {
      expect(screen.getByTestId("update-profile")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Platform Charges"));
    fireEvent.click(screen.getByText("Close"));
  });
});
