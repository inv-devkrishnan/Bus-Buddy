import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ListCoupon from '../components/admin/coupon/ListCoupon';
import { axiosApi } from '../utils/axiosApi';
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter } from 'react-router-dom';


let data = {
    coupons: [{
        id: 1,
        coupon_name: "sample coupon",
        coupon_code: "coupon code",
        valid_till: "2023-12-12",
        one_time_use: 0,
        discount: 10,
        coupon_eligibility: 0,
        coupon_availability: 0,
        status: 0,
    },
    ],
    pages: 1,
    current_page: 1,
    has_previous: false
}

let mock;
beforeEach(() => {
    mock = new MockAdapter(axiosApi);
});

afterEach(() => {
    mock.restore();
});
describe("list coupon", () => {
    it('render list coupon', () => {
        render(
            <BrowserRouter>
                <ListCoupon />
            </BrowserRouter>
        )
        mock.onGet(`adminstrator/view-coupon/`).reply(200, data);
    })

    it('render list coupon fail 1', () => {
        render(
            <BrowserRouter>
                <ListCoupon />
            </BrowserRouter>
        )
        mock.onGet(`adminstrator/view-coupon/`).reply(400);
    })
    it('render list coupon fail 2', () => {
        render(
            <BrowserRouter>
                <ListCoupon />
            </BrowserRouter>
        )
        mock.onGet(`adminstrator/view-coupon/`).reply(200, { error_code: "1027" });
    })

    it('render view coupons by status', async () => {
        render(
            <BrowserRouter>
                <ListCoupon />
            </BrowserRouter>
        )
        mock.onGet(`adminstrator/view-coupon/`).reply(200,data);
        await new Promise(resolve => setTimeout(resolve, 2000))
        fireEvent.click(screen.getByText("View : All"))
        fireEvent.click(screen.getByText("Active Coupons"))
      
        mock.onGet(`adminstrator/view-coupon/?page=1&status=0`).reply(200, data);
        await waitFor(() => {
            expect(screen.getByText('View : Active Coupons')).toBeInTheDocument();
        });
        await new Promise(resolve => setTimeout(resolve, 2000))
        fireEvent.click(screen.getByText("View : Active Coupons"))
        fireEvent.click(screen.getByText("InActive Coupons"))
        mock.onGet(`adminstrator/view-coupon/?page=1&status=1`).reply(200, data);
        fireEvent.click(screen.getByText("View : Inactive Coupons"))
        fireEvent.click(screen.getByText("All"))
    })

    it('search coupons', async () => {
        render(
            <BrowserRouter>
                <ListCoupon />
            </BrowserRouter>
        )
        mock.onGet(`adminstrator/view-coupon/`).reply(200);
        fireEvent.change(screen.getByPlaceholderText("Search by coupon name"),{
            target: { value: "defv" },
        })
        fireEvent.click(screen.getByText("Search"))

        fireEvent.click(screen.getByText("Clear"))
    })

    it('create coupon', async () => {
        render(
            <BrowserRouter>
                <ListCoupon />
            </BrowserRouter>
        )
        mock.onGet(`adminstrator/view-coupon/`).reply(200);
        fireEvent.click(screen.getByText("New Coupon"))
    })
})