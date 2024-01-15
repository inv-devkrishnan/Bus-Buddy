import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import AvailableCoupons from "../components/User/AvailableCoupons";
import { UserContextProvider } from "../components/User/UserContext";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

jest.mock("../assets/images/couponOther.png");

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("AvailableCoupons component", () => {
  const data = [
    {
      id: 2,
      coupon_code: "TT435425b1",
      coupon_name: "Christmas offer",
      coupon_description:
        "35% off on this trip hfdshsdhfsdfhbdfgh zhcjhzxuyvhgsdhjfbjhsdf xnbchxgvysdgfhsdbfjhsdf hxvcbhxcygfshydfgbhjzBC hzxbchzgcyegfhsbfczBC",
      coupon_eligibility: 0,
      coupon_availability: 1,
      valid_till: "2024-12-25",
      one_time_use: 1,
      discount: 35,
      status: 0,
      created_date: "2023-12-27T15:38:30.947614Z",
      updated_date: "2023-12-27T15:38:30.947614Z",
      user: 2,
      trip: null,
    },
  ];
  const currentTrip = {
    data: {
      amenities: {
        emergency_no: 1,
        water_bottle: 1,
        charging_point: 1,
        usb_port: 1,
        blankets: 1,
        pillows: 1,
        reading_light: 0,
        snacks: 0,
        toilet: 0,
        tour_guide: 0,
        cctv: 1,
      },
      bus: 1,
      bus_name: "Tara",
      company_name: "Shekar travels",
      end_location_arrival_date: "2024-01-31",
      end_location_arrival_time: "14:20:00",
      gst: 18,
      route: 1,
      route_cost: 2488,
      start_location_arrival_date: "2024-01-31",
      start_location_arrival_time: "10:00:00",
      travel_fare: 2588,
      trip: 4,
      via: "Alappuzha",
      endLocation: "10",
      endLocationName: "Thiruvananthapuram",
      isOpen: true,
      seatViewOpen: 0,
      startLocation: "2",
      startLocationName: "Ernakulam",
    },
  };
  localStorage.setItem("current_trip", JSON.stringify(currentTrip));
  localStorage.setItem("total_amount", 1000);
 
  it("renders component and other events", async () => {
    mock.onGet(`user/available-coupons/?trip_id=4`).reply(200, data);

    render(
      <UserContextProvider>
        <AvailableCoupons totalAmount={1000} setTotalAmount={jest.fn()} />
      </UserContextProvider>
    );

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const descriptionButton = screen.getByTestId("description_button");
    fireEvent.click(descriptionButton);

    const copyButton = screen.getByTestId("copy_button");
    fireEvent.click(copyButton);

    const removeButton = screen.getByTestId("remove_coupon_button");
    fireEvent.click(removeButton);

    const couponTextBoxElse = screen.getByPlaceholderText("Coupon Code");
    fireEvent.change(couponTextBoxElse, { target: { value: "" } });

    const allCouponsButton = screen.getByTestId("all_coupons_button");
    fireEvent.click(allCouponsButton);

    const modalCopyButton = screen.getByTestId("modal_copy_button");
    fireEvent.click(modalCopyButton);

    const modalCloseButton = screen.getByText("Close");
    fireEvent.click(modalCloseButton);
  });

  it("catch error", () => {
    mock.onGet(`user/available-coupons/?trip_id=1`).reply(400);

    render(
      <UserContextProvider>
        <AvailableCoupons totalAmount={1000} setTotalAmount={jest.fn()} />
      </UserContextProvider>
    );
  });

  it("apply coupon", async () => {
    mock.onGet(`user/available-coupons/?trip_id=4`).reply(200, data);

    render(
      <UserContextProvider>
        <AvailableCoupons totalAmount={1000} setTotalAmount={jest.fn()} />
      </UserContextProvider>
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const applyButtonFirst = screen.getByTestId("apply_coupon");
    fireEvent.click(applyButtonFirst);

    const couponTextBox = screen.getByPlaceholderText("Coupon Code");
    fireEvent.change(couponTextBox, { target: { value: "ABCD123" } });

    const copyButton = screen.getByTestId("copy_button");
    fireEvent.click(copyButton);

    const applyButton = screen.getByTestId("apply_coupon");
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(screen.getByText("Applying coupon")).toBeInTheDocument();
    });
    const validCoupon = {
      valid: "Valid coupon",
      coupon_status: "200",
    };
    mock.onGet('user/redeem-coupon/?trip_id=4&coupon_id=2').reply(200, validCoupon);
  });
});
