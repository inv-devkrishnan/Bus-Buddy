import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CouponOther from "../components/User/CouponOther";

jest.mock("../assets/images/couponOther.png");

describe("CouponOther component", () => {
  it("renders component", () => {
    render(
      <CouponOther
        data={{
          id: 1,
          coupon_name: "Name",
          coupon_description: "Description",
          coupon_code: "CODE123",
        }}
        setCouponValue={jest.fn()}
        setCouponData={jest.fn()}
        setCouponError={jest.fn()}
      />
    );
  });
});
