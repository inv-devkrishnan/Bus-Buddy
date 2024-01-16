import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminProfile from "../components/admin/profile/AdminProfile";

describe("admin profile", () => {
    test("admin profile render", () => {
        render(
            <BrowserRouter>
                <AdminProfile />
            </BrowserRouter>
        )
    })
})