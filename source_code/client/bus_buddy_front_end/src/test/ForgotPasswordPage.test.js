import React from "react";
import { render, fireEvent, screen,waitFor } from "@testing-library/react";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import { BrowserRouter, useLocation } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import { openAxiosApi } from "../utils/axiosApi";

let mock;
beforeEach(() => {
  mock = new MockAdapter(openAxiosApi);
});

afterEach(() => {
  mock.restore();
});
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn().mockReturnValue({
    search: "",
  }),
}));

const renderWithValidToken =async() =>
{
    let res={
        is_token_valid : true,
    }
    mock.onPost(`account/forgot-password-verify/`).reply(200,res);
    useLocation.mockImplementation(
      jest.fn().mockReturnValue({
        search: "?token=fbhewkih3498t2gh484fbn",
      })
    );
    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );
    await waitFor(() => {
        expect(screen.getByText('Reset Password')).toBeInTheDocument();
    });
}
describe("forgot password page", () => {
  test("render with no token", () => {
    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );
  });

  test("render with invalid token", () => {
    let res={
        error_code : "code",
    }
    mock.onPost(`account/forgot-password-verify/`).reply(200,res);
    useLocation.mockImplementation(
      jest.fn().mockReturnValue({
        search: "?token=fbhewkih3498t2gh484fbn",
      })
    );
    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );
  });
  test("render with valid token", async() => {
 
    await renderWithValidToken();
    fireEvent.click(screen.getByText("Change Password"));
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test("render with invalid new password", async() => {
 
   await renderWithValidToken();
   fireEvent.change(screen.getByPlaceholderText("New Password"),{
     target : {value: "123"}
   })
   fireEvent.blur((screen.getByPlaceholderText("New Password")))
   await new Promise(resolve => setTimeout(resolve, 2000));
   fireEvent.change(screen.getByPlaceholderText("Re enter Password"),{
    target : {value: "1235"}
  })
  fireEvent.blur((screen.getByPlaceholderText("Re enter Password")))
  await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test("render with valid new password",async()=>{
    let res={
        message : "password changed",
    }
    mock.onPut(`account/forgot-password-change/`).reply(200,res);
    await renderWithValidToken();
    fireEvent.change(screen.getByPlaceholderText("New Password"),{
      target : {value: "Devk@207"}
    })
    fireEvent.blur((screen.getByPlaceholderText("New Password")))
    fireEvent.change(screen.getByPlaceholderText("Re enter Password"),{
     target : {value: "Devk@207"}
   })
   fireEvent.blur((screen.getByPlaceholderText("Re enter Password")))
   fireEvent.click(screen.getByText("Change Password"));
   await new Promise(resolve => setTimeout(resolve, 2000));
  })

  test("render with valid new password fail 1",async()=>{
    let res={
        error_code : "D1023",
    }
    mock.onPut(`account/forgot-password-change/`).reply(200,res);
    await renderWithValidToken();
    fireEvent.change(screen.getByPlaceholderText("New Password"),{
      target : {value: "Devk@207"}
    })
    fireEvent.blur((screen.getByPlaceholderText("New Password")))
    fireEvent.change(screen.getByPlaceholderText("Re enter Password"),{
     target : {value: "Devk@207"}
   })
   fireEvent.blur((screen.getByPlaceholderText("Re enter Password")))
   fireEvent.click(screen.getByText("Change Password"));
   await new Promise(resolve => setTimeout(resolve, 2000));
  })

  test("render with valid new password fail 2",async()=>{
    
    mock.onPut(`account/forgot-password-change/`).reply(400);
    await renderWithValidToken();
    fireEvent.change(screen.getByPlaceholderText("New Password"),{
      target : {value: "Devk@207"}
    })
    fireEvent.blur((screen.getByPlaceholderText("New Password")))
    fireEvent.change(screen.getByPlaceholderText("Re enter Password"),{
     target : {value: "Devk@207"}
   })
   fireEvent.blur((screen.getByPlaceholderText("Re enter Password")))
   fireEvent.click(screen.getByText("Change Password"));
   await new Promise(resolve => setTimeout(resolve, 2000));
  })

  test("render with token fail", () => {
    mock.onPost(`account/forgot-password-verify/`).reply(400);
    useLocation.mockImplementation(
      jest.fn().mockReturnValue({
        search: "?token=fbhewkih3498t2gh484fbn",
      })
    );
    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );
  });
});
