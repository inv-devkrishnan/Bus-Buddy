import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ListUsers from "../components/admin/ListUsers";
import MockAdapter from "axios-mock-adapter";
import { axiosApi } from "../utils/axiosApi";
let mock;

beforeEach(() => {
    mock = new MockAdapter(axiosApi);
});

afterEach(() => {
    mock.restore();
});
let data = {
    users: [{ id: 1, first_name: "dev", role: 2, email: "dev@gmail.com", status: 0 }, { id: 2, first_name: "tom", role: 3, email: "tom@gmail.com", status: 3 }],
    pages: 1,
    current_page: 1,
    has_previous: false
}
describe("list user", () => {
    test("list user", () => {
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
    })

    test("list user fail", () => {
        mock.onGet(`adminstrator/list-users/`).reply(400);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
    })

    test("list user ascending and decending", async () => {
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Sort : None"));
        fireEvent.click(screen.getByText("Name Ascending"));
        fireEvent.click(screen.getByText("Sort : Name Ascending"));
        fireEvent.click(screen.getByText("Name Descending"));
        await waitFor(() => {
            expect(screen.getByText('Sort : Name Descending')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Sort : Name Descending"));
        fireEvent.click(screen.getByText("None"));
    })

    test("list user by status", async () => {
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Show All Users"));
        fireEvent.click(screen.getByText("Banned Users"));
        await waitFor(() => {
            expect(screen.getByText('Show Banned Users')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Show Banned Users"));
        fireEvent.click(screen.getByText("Unbanned Users"));


    })

    test("list user by Unbanned Users", async () => {
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Show All Users"));
        fireEvent.click(screen.getByText("Unbanned Users"));
        await waitFor(() => {
            expect(screen.getByText('Show Unbanned Users')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Show All"));
    })

    test("list user by search", async () => {
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.change(screen.getByPlaceholderText("Search"), {
            target: { value: "dev" },
        });
        fireEvent.click(screen.getByText("Search"));
        fireEvent.click(screen.getByText("Clear"));
    })

    test("ban user", async () => {
        let data = {
            users: [{ id: 1, first_name: "dev", role: 2, email: "dev@gmail.com", status: 0 }],
            pages: 1,
            current_page: 1,
            has_previous: false
        }
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Ban User"));
        fireEvent.click(screen.getByText("Ban user"));
        mock.onPut(`adminstrator/ban-user/1/`).reply(200, data);
    })

    test("ban user fail", async () => {
        let data = {
            users: [{ id: 1, first_name: "dev", role: 2, email: "dev@gmail.com", status: 0 }],
            pages: 1,
            current_page: 1,
            has_previous: false
        }
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Ban User"));
        fireEvent.click(screen.getByText("Ban user"));
        mock.onPut(`adminstrator/ban-user/1/`).reply(400, data);
    })

    test("unban user", async () => {
        let data = {
            users: [{ id: 1, first_name: "dev", role: 2, email: "dev@gmail.com", status: 2 }],
            pages: 1,
            current_page: 1,
            has_previous: false
        }
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Unban User"));
        fireEvent.click(screen.getByText("UnBan user"));
        mock.onPut(`adminstrator/unban-user/1/`).reply(200, data);
    })

    test("unban user fail", async () => {
        let data = {
            users: [{ id: 1, first_name: "dev", role: 2, email: "dev@gmail.com", status: 2 }],
            pages: 1,
            current_page: 1,
            has_previous: false
        }
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("Unban User"));
        fireEvent.click(screen.getByText("UnBan user"));
        mock.onPut(`adminstrator/unban-user/1/`).reply(400, data);
    })

    test("remove user", async () => {
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        const removeUserElements = screen.getAllByText('Remove User');
        fireEvent.click(removeUserElements[0]);
        fireEvent.click(screen.getByText("Remove user"));
        mock.onPut(`adminstrator/remove-user/1/`).reply(200, data);
    })

    test("remove user single", async () => {
        let data = {
            users: [{ id: 1, first_name: "dev", role: 2, email: "dev@gmail.com", status: 0 }],
            pages: 1,
            current_page: 1,
            has_previous: false
        }
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        const removeUserElements = screen.getAllByText('Remove User');
        fireEvent.click(removeUserElements[0]);
        fireEvent.click(screen.getByText("Remove user"));
        mock.onPut(`adminstrator/remove-user/1/`).reply(200, data);
    })

    test("remove user has previous", async () => {
        let data = {
            users: [{ id: 1, first_name: "swan", role: 2, email: "dev@gmail.com", status: 0 }],
            pages: 2,
            current_page: 2,
            has_previous: true
        }
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        const removeUserElements = screen.getAllByText('Remove User');
        fireEvent.click(removeUserElements[0]);
        fireEvent.click(screen.getByText("Remove user"));
        mock.onPut(`adminstrator/remove-user/1/`).reply(200, data);
    })

    test("ban user fail", async () => {
        let data = {
            users: [{ id: 1, first_name: "dark", role: 2, email: "dev@gmail.com", status: 0 }],
            pages: 1,
            current_page: 1,
            has_previous: false
        }
        mock.onGet(`adminstrator/list-users/`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={false} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });

        const removeUserElements = screen.getAllByText('Remove User');
        fireEvent.click(removeUserElements[0]);
        fireEvent.click(screen.getByText("Remove user"));
        mock.onPut(`adminstrator/remove-user/1/`).reply(400, data);
        
    })

    test("list bus owner", () => {
        mock.onGet(`adminstrator/list-users/?status=3`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={true} />
            </BrowserRouter>
        )
    })

    test("list bus owner by search", async () => {
        mock.onGet(`adminstrator/list-users/?status=3`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={true} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.change(screen.getByPlaceholderText("Search"), {
            target: { value: "tom" },
        });
        fireEvent.click(screen.getByText("Search"));
        fireEvent.click(screen.getByText("Clear"));
    })

    test("list bus owner view details and aproval", async () => {
        mock.onGet(`adminstrator/list-users/?status=3`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={true} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("View Details"));
        fireEvent.click(screen.getByText("Approve Bus Owner"));
        fireEvent.click(screen.getByText("Yes"));
        mock.onPut(`adminstrator/approve-bus-owner/2/`).reply(200, data);
    })
    test("list bus owner view details and aproval fail", async () => {
        let data = {
            users: [{ id: 2, first_name: "tam", role: 3, email: "tam@gmail.com", status: 3 }],
            pages: 5,
            current_page: 3,
            has_previous: true
        }
        mock.onGet(`adminstrator/list-users/?status=3`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={true} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("View Details"));
        fireEvent.click(screen.getByText("Approve Bus Owner"));
        fireEvent.click(screen.getByText("Yes"));
        mock.onPut(`adminstrator/approve-bus-owner/2/`).reply(400, data);
    })
    test("list bus owner view details and aproval has previous", async () => {
        let data = {
            users: [{ id: 2, first_name: "jam", role: 3, email: "jam@gmail.com", status: 3,aadhaar_no:"123412341234" }],
            pages: 8,
            current_page: 10,
            has_previous: true
        }
        mock.onGet(`adminstrator/list-users/?status=3`).reply(200, data);
        render(
            <BrowserRouter>
                <ListUsers busApproval={true} />
            </BrowserRouter>
        )
        await waitFor(() => {
            expect(screen.getByText('Role')).toBeInTheDocument();
        });
        fireEvent.click(screen.getByText("View Details"));
        fireEvent.click(screen.getByText("Approve Bus Owner"));
        fireEvent.click(screen.getByText("Yes"));
        mock.onPut(`adminstrator/approve-bus-owner/2/`).reply(200, data);
    })
})