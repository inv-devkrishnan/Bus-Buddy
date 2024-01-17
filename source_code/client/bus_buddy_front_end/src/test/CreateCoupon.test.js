import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/extend-expect';
import CreateCoupon from '../components/admin/coupon/CreateCoupon';
import { axiosApi } from '../utils/axiosApi';
import MockAdapter from "axios-mock-adapter";
import { BrowserRouter } from 'react-router-dom';

let mock;
beforeEach(() => {
    mock = new MockAdapter(axiosApi);
});

afterEach(() => {
    mock.restore();
});
describe("create coupon", () => {

    it("create coupon render blank entry", async () => {
        render(
            <BrowserRouter>
                <CreateCoupon />
            </BrowserRouter>

        )
            fireEvent.click(screen.getByText("Create Coupon"));
            await waitFor(() => {
                expect(screen.getByText('* Coupon name required')).toBeInTheDocument();
            });

    })

    it("create coupon render valid entry", () => {
        render(
            <BrowserRouter>
                <CreateCoupon />
            </BrowserRouter>

        )
        userEvent.type(
            screen.getByPlaceholderText("Coupon Name (maximum 80 characters)"),
            "Test Coupon"
        );
        userEvent.type(
            screen.getByPlaceholderText("Coupon Description (maximum 500 characters)"),
            "Test Coupon Description"
        );

        userEvent.type(
            screen.getByPlaceholderText("date"),
            "2024-01-30"
        );

        userEvent.type(
            screen.getByPlaceholderText("Discount in percentage"),
            "10"
        );


        fireEvent.click(screen.getByText("Create Coupon"));
        mock.onPost(`adminstrator/create-coupon/`).reply(200, { success_code: "1054" });
    })



    it("create coupon render fail", () => {
        render(
            <BrowserRouter>
                <CreateCoupon />
            </BrowserRouter>

        )
        userEvent.type(
            screen.getByPlaceholderText("Coupon Name (maximum 80 characters)"),
            "Test fdsfsCoupon"
        );
        userEvent.type(
            screen.getByPlaceholderText("Coupon Description (maximum 500 characters)"),
            "Test fdsfsdfsdCoupon Description"
        );

        userEvent.type(
            screen.getByPlaceholderText("date"),
            "2024-01-31"
        );

        userEvent.type(
            screen.getByPlaceholderText("Discount in percentage"),
            "20"
        );
        fireEvent.click(screen.getByText("Create Coupon"));
        mock.onPost(`adminstrator/create-coupon/`).reply(400);
    })

    it("create coupon render fail 2", () => {
        render(
            <BrowserRouter>
                <CreateCoupon />
            </BrowserRouter>

        )
        userEvent.type(
            screen.getByPlaceholderText("Coupon Name (maximum 80 characters)"),
            "Test fdsfsCfsdfoupon"
        );
        userEvent.type(
            screen.getByPlaceholderText("Coupon Description (maximum 500 characters)"),
            "Test fdsfsdfsdCoupon Descgsdfgsfription"
        );

        userEvent.type(
            screen.getByPlaceholderText("date"),
            "2024-01-27"
        );

        userEvent.type(
            screen.getByPlaceholderText("Discount in percentage"),
            "21"
        );
        fireEvent.click(screen.getByText("Create Coupon"));
        mock.onPost(`adminstrator/create-coupon/`).reply(200, { error_code: "1057" });
    })

    it("create coupon availability bus owner", () => {
        render(
            <BrowserRouter>
                <CreateCoupon />
            </BrowserRouter>

        )
        const data = [
            {
                id: 1,
                first_name: "def",
                company_name: "dew"
            }
        ]

        mock.onGet(`adminstrator/create-coupon/?status=0`).reply(200, data);
        userEvent.selectOptions(
            screen.getByTestId("coupon-availability"),
            "To trips of a specifc bus owner"
        );

    })

    it("create coupon availability bus owner error", () => {
        render(
            <BrowserRouter>
                <CreateCoupon />
            </BrowserRouter>

        )
        mock.onGet(`adminstrator/create-coupon/?status=0`).reply(200, { error_code: "2054" });
        userEvent.selectOptions(
            screen.getByTestId("coupon-availability"),
            "To trips of a specifc bus owner"
        );

    })


    it("create coupon availability trip", () => {
        render(
            <BrowserRouter>
                <CreateCoupon />
            </BrowserRouter>

        )
        const data = [
            {
                id: 1,
                route: {
                    start_point: { location_name: "def" },
                    end_point: { location_name: "ddsf" }
                },
                start_date: "2023-12-12",
                user: { company_name: "dert" }
            }
        ]

        mock.onGet(`adminstrator/create-coupon/?status=1`).reply(200, data);
        userEvent.selectOptions(
            screen.getByTestId("coupon-availability"),
            "To a particular trip"
        );

    })

    it("create coupon availability trip error", () => {
        render(
            <BrowserRouter>
                <CreateCoupon />
            </BrowserRouter>

        )

        mock.onGet(`adminstrator/create-coupon/?status=1`).reply(200, { error_code: "1025" });
        userEvent.selectOptions(
            screen.getByTestId("coupon-availability"),
            "To a particular trip"
        );

    })
})