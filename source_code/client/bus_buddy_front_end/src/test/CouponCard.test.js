import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CouponCard from '../components/admin/coupon/CouponCard';
import { axiosApi } from '../utils/axiosApi';
import MockAdapter from "axios-mock-adapter";

let coupon = {
    id: 1,
    coupon_name: "sample coupon",
    coupon_code: "coupon code",
    valid_till: "2023-12-12",
    one_time_use: 0,
    discount:10,
    coupon_eligibility:0,
    coupon_availability:0,
    status:0,
  };

  let couponActivate = {
    id: 2,
    coupon_name: "sample coupon 4",
    coupon_code: "coupon cod5e",
    valid_till: "2023-12-12",
    one_time_use: 0,
    discount:16,
    coupon_eligibility:1,
    coupon_availability:1,
    status:1,
  }; 

  let couponActivate2 = {
    id: 2,
    coupon_name: "sample coupon 4564",
    coupon_code: "coup342on cod5e",
    valid_till: "2023-12-12",
    one_time_use: 0,
    discount:16,
    coupon_eligibility:1,
    coupon_availability:2,
    status:1,
  };

  let mock;
beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe('ComplaintCard component', () => {


    it('renders with given props', () => {
      render(
        <CouponCard
        coupon={coupon}
        getCouponsByPage={()=>{}}
        currentPage={1}
        couponListLenght={1}
        hasPrevious={false}
      ></CouponCard>
      );
     fireEvent.click(screen.getByText("View Details"))
     fireEvent.click(screen.getByText("Close"))
    });

    it('renders with given props non one time use', () => {
        let coupon = {
            id: 2,
            coupon_name: "sample coupon 1",
            coupon_code: "coupon code 2",
            valid_till: "2023-12-11",
            one_time_use: 1,
            discount:20,
          };
        render(
          <CouponCard
          coupon={coupon}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={1}
          hasPrevious={false}
        ></CouponCard>
        );
       
      });

      it('delete coupon', () => {
        render(
          <CouponCard
          coupon={coupon}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={1}
          hasPrevious={true}
        ></CouponCard>
        );
       fireEvent.click(screen.getByText("Delete"))
       fireEvent.click(screen.getByText("Delete coupon"))
       mock.onPut(`adminstrator/delete-coupon/1/`).reply(200,{success_code:"1025"});
      });

      it('delete coupon fail 1', () => {
        render(
          <CouponCard
          coupon={coupon}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={1}
          hasPrevious={false}
        ></CouponCard>
        );
       fireEvent.click(screen.getByText("Delete"))
       fireEvent.click(screen.getByText("Delete coupon"))
       mock.onPut(`adminstrator/delete-coupon/1/`).reply(400);
      });

      it('delete coupon fail 2', () => {
        render(
          <CouponCard
          coupon={coupon}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={1}
          hasPrevious={false}
        ></CouponCard>
        );
       fireEvent.click(screen.getByText("Delete"))
       fireEvent.click(screen.getByText("Delete coupon"))
       mock.onPut(`adminstrator/delete-coupon/1/`).reply(200,{error_code:"1025"});
      });


      it('dectivate coupon', () => {
        render(
          <CouponCard
          coupon={coupon}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={1}
          hasPrevious={false}
        ></CouponCard>
        );
       fireEvent.click(screen.getByText("Deactivate"))
       fireEvent.click(screen.getByText("Deactivate coupon"))
       mock.onPut(`adminstrator/deactivate-coupon/1/`).reply(200,{success_code:"1025"});
      });

      it('deactivate coupon fail 1', () => {
        render(
          <CouponCard
          coupon={coupon}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={1}
          hasPrevious={false}
        ></CouponCard>
        );
       fireEvent.click(screen.getByText("Deactivate"))
       fireEvent.click(screen.getByText("Deactivate coupon"))
       mock.onPut(`adminstrator/deactivate-coupon/1/`).reply(400);
      });

      it('deactivate coupon fail 2', () => {
        render(
          <CouponCard
          coupon={coupon}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={1}
          hasPrevious={false}
        ></CouponCard>
        );
       fireEvent.click(screen.getByText("Deactivate"))
       fireEvent.click(screen.getByText("Deactivate coupon"))
       mock.onPut(`adminstrator/deactivate-coupon/1/`).reply(200,{error_code:"1025"});
      });

      it('activate coupon', () => {
        render(
          <CouponCard
          coupon={couponActivate}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={5}
          hasPrevious={false}
        ></CouponCard>
        );
       fireEvent.click(screen.getByText("Activate"))
       fireEvent.click(screen.getByText("Activate coupon"))
       mock.onPut(`adminstrator/activate-coupon/2/`).reply(200,{success_code:"1025"});
      });

      it('activate fail 1', () => {
        render(
          <CouponCard
          coupon={couponActivate}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={1}
          hasPrevious={false}
        ></CouponCard>
        );
       fireEvent.click(screen.getByText("Activate"))
       fireEvent.click(screen.getByText("Activate coupon"))
       mock.onPut(`adminstrator/activate-coupon/2/`).reply(400,{error_code:"1045"});
      });

      it('activate fail 2', () => {
        render(
          <CouponCard
          coupon={couponActivate2}
          getCouponsByPage={()=>{}}
          currentPage={1}
          couponListLenght={1}
          hasPrevious={false}
        ></CouponCard>
        );
       fireEvent.click(screen.getByText("Activate"))
       fireEvent.click(screen.getByText("Activate coupon"))
       mock.onPut(`adminstrator/activate-coupon/2/`).reply(200,{error_code:"1027"});
      });
  
});