import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import { login, forgotPasswordSendEmail } from "../utils/apiCalls";

jest.mock("../assets/images/login_splash.jpg");
jest.mock("../utils/apiCalls");

jest.mock("../utils/hooks/useAuth", () => ({
  ...jest.requireActual("../utils/hooks/useAuth"),
  useAuthStatus: () => {
    return true;
  },
}));
describe("login page", () => {
  test("login page render", async () => {
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
  });

  test("login process success", () => {
    login.mockResolvedValueOnce({
      status: true,
      message: {},
    });
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    // Fill in the email field
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });

    // Fill in the password field
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("set-show-password"));
    fireEvent.click(screen.getByTestId("set-show-password"));
    // Click the submit button
    fireEvent.click(screen.getByTestId("login-button"));
  });

  test("login process fail", () => {
    login.mockResolvedValueOnce({
      status: false,
      message: {
        response: {
          data: {
            error_code: "123",
          },
        },
      },
    });
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    // Fill in the email field
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "test@example.com" },
    });

    // Fill in the password field
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("set-show-password"));
    fireEvent.click(screen.getByTestId("set-show-password"));
    // Click the submit button
    fireEvent.click(screen.getByTestId("login-button"));
  });

  test("login process invalid", () => {
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    // Fill in the email field
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "teseexampleom" },
    });

    // Fill in the password field
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    // Click the submit button
    fireEvent.click(screen.getByTestId("login-button"));
  });

  test("browse guest", () => {
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("browse-guest"));
  });

  test("forgot password", () => {
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("forgot-password"));
    fireEvent.click(screen.getByText("Close"));
  });

  test("forgot password valid email", () => {
    forgotPasswordSendEmail.mockResolvedValueOnce({
      status: true,
      message: { message: "email sent" },
    });
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("forgot-password"));
    fireEvent.change(screen.getAllByPlaceholderText("name@example.com")[0], {
      target: { value: "devanaswinikumar8@gmail.com" },
    });
    fireEvent.click(screen.getByText("Send Email"));
  });

  test("forgot password  send email fail 1", () => {
    forgotPasswordSendEmail.mockResolvedValueOnce({
      status: true,
      message: { error_code: "D102" },
    });
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("forgot-password"));
    fireEvent.change(screen.getAllByPlaceholderText("name@example.com")[0], {
      target: { value: "desk8@gmail.com" },
    });
    fireEvent.click(screen.getByText("Send Email"));
  });

  test("forgot password  send email fail 2", () => {
    forgotPasswordSendEmail.mockResolvedValueOnce({
      status: true,
      message: { fdsf: "D102" },
    });
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("forgot-password"));
    fireEvent.change(screen.getAllByPlaceholderText("name@example.com")[0], {
      target: { value: "desk48@gmail.com" },
    });
    fireEvent.click(screen.getByText("Send Email"));
  });

  test("forgot password invalid email", async() => {
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("forgot-password"));
    fireEvent.change(screen.getAllByPlaceholderText("name@example.com")[0], {
      target: { value: "test@test" },
    });
    fireEvent.click(screen.getByText("Send Email"));
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
  test("forgot password empty email", async() => {
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("forgot-password"));
    fireEvent.change(screen.getAllByPlaceholderText("name@example.com")[0], {
      target: { value: "" },
    });
    fireEvent.click(screen.getByText("Send Email"));
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test("register user", () => {
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("register"));
    fireEvent.click(screen.getByTestId("register-user"));
  });

  test("register owner", () => {
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    fireEvent.click(screen.getByTestId("register"));
    fireEvent.click(screen.getByTestId("register-owner"));
  });

  test("login with current trip data", () => {
    localStorage.setItem(
      "current_trip",
      '{"data":{"route":10,"start_location_arrival_time":"08:00:00","end_location_arrival_time":"10:15:00","start_location_arrival_date":"2024-01-19","end_location_arrival_date":"2024-01-19","via":"Thrissur","travel_fare":200,"trip":178,"bus_name":"NiviBus","bus":7,"company_name":"Nivil Travels","route_cost":100,"gst":2,"amenities":{"emergency_no":1,"water_bottle":1,"charging_point":1,"usb_port":1,"blankets":1,"pillows":1,"reading_light":0,"toilet":0,"snacks":0,"tour_guide":0,"cctv":1}},"startLocation":"6","startLocationName":"Ernakulam","endLocation":"7","endLocationName":"Thrissur","seatViewOpen":0,"isOpen":true}'
    );
    localStorage.setItem(
      "seat_list",
      '[{"id":181,"seat_number":"a11","seat_type":0,"deck":0,"seat_cost":"100.000","bus":7,"seat_ui_order":11,"booked":[],"female_only":false,"male_only":false}]'
    );
    render(
      <GoogleOAuthProvider>
        <SeatContextProvider>
          <AddSeatContextProvider>
            <UserContextProvider>
              <BrowserRouter>
                <LoginPage />
              </BrowserRouter>
            </UserContextProvider>
          </AddSeatContextProvider>
        </SeatContextProvider>
      </GoogleOAuthProvider>
    );
    localStorage.clear();
  });
});
