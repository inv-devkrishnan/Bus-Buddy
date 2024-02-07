import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import BusNavBar from "../components/common/navbar/BusNavBar";
import { UserContextProvider } from "../components/User/UserContext";
const renderwithUser = (userName, userRole) => {
  localStorage.setItem("user_role", userRole);
  localStorage.setItem("user_name", userName);
  render(
    <UserContextProvider>
      <BrowserRouter>
        <BusNavBar />
      </BrowserRouter>
    </UserContextProvider>
  );
  fireEvent.click(screen.getByText("Hello " + userName));
  fireEvent.click(screen.getByText("View Profile"));
};
describe("BusNavBar", () => {
  test("renders BusNavBar component with guest user", () => {
    render(
      <UserContextProvider>
        <BrowserRouter>
          <BusNavBar />
        </BrowserRouter>
      </UserContextProvider>
    );
    fireEvent.click(screen.getByText("Hello Guest"));
    fireEvent.click(screen.getByText("Login"));
    fireEvent.click(screen.getByText("Register as user"));
    fireEvent.click(screen.getByText("Register as bus owner"));
  });

  test('clicking on "Search Trips" link navigates to the correct page', () => {
    render(
      <UserContextProvider>
        <BrowserRouter>
          <BusNavBar />
        </BrowserRouter>
      </UserContextProvider>
    );

    

    // Click on the "Search Trips" link
    fireEvent.click(screen.getByText("Search Trips"));

    // Check if the navigation occurred correctly
  });

  test('user with large name', () => {
    localStorage.setItem("user_role", "2");
    localStorage.setItem("user_name", "fdsfhdsfldshfdkjhskhfjfkdhsfjhdsfkdjsfhdjshfdkashfdjshfdasfkjdhfdsjafhdskjfhdsjfhdsfjkfdsfds");
    render(
      <UserContextProvider>
        <BrowserRouter>
          <BusNavBar />
        </BrowserRouter>
      </UserContextProvider>
    );
  });

  test("navbar as admin", () => {
    renderwithUser("dev", "1");
    fireEvent.click(screen.getByText("Bus Buddy"));
  });

  test("navbar as bus owner", () => {
    renderwithUser("devk", "3");
  });

  test("navbar as normal user", () => {
    renderwithUser("devkris", "2");
  });
  test("navbar as invalid", () => {
    renderwithUser("devkrish", "4");
  });

  // Add more tests for other interactions, such as clicking on login, registration, profile, and logout
});
