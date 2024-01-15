import React from "react";
import { render, fireEvent, screen} from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SeatContextProvider } from "../utils/SeatContext";
import { AddSeatContextProvider } from "../utils/AddSeatContext";
import { UserContextProvider } from "../components/User/UserContext";
import { login } from "../utils/apiCalls";

jest.mock("../assets/images/login_splash.jpg");
jest.mock("../utils/apiCalls");

jest.mock("../utils/hooks/useAuth", () => ({
  ...jest.requireActual("../utils/hooks/useAuth"),
  useAuthStatus: ()=>{return true},
}));
describe("login page", () => {
  test("login page render", async() => {
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
});
