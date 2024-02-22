import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ComplaintForm from "../components/User/ComplaintForm";
import { axiosApi } from "../utils/axiosApi";
import MockAdapter from "axios-mock-adapter";

let mock;

beforeEach(() => {
  mock = new MockAdapter(axiosApi);
});

afterEach(() => {
  mock.restore();
});

describe("ComplaintForm component", () => {
  it("renders component", () => {
    render(<ComplaintForm />);
  });

  it("gets admin and bus owner ids and other form events", async () => {
    const data = [1, [[2, "Shekar travels"]]];
    mock.onGet(`user/register-complaint/`).reply(200, data);

    render(<ComplaintForm />);

    const adminRadio = screen.getByTestId("admin_radio");
    fireEvent.click(adminRadio);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const busRadio = screen.getByTestId("bus_radio");
    fireEvent.click(busRadio);

    const file = new File(["(⌐□_□)"], "sample.jpg", { type: "image/jpg" });
    const photoInput = screen.getByLabelText("Upload image as proof:");
    fireEvent.click(photoInput);
    fireEvent.change(photoInput, {
      target: { files: [file] },
    });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
  });

  it("gets admin and bus owner ids-catch error", async () => {
    mock.onGet(`user/register-complaint/`).reply(400);

    render(<ComplaintForm />);
    const file = new File(["(⌐□_□)"], "sample.html", { type: "image/html" });
    const photoInput = screen.getByLabelText("Upload image as proof:");
    fireEvent.click(photoInput);
    fireEvent.change(photoInput, {
      target: { files: [file] },
    });

  });

  it("gets admin and form clear", async () => {
    mock.onGet(`user/register-complaint/`).reply(400);

    render(<ComplaintForm />);

    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);
  });

  it("gets admin and form submit",  async() => {
    const data = [1, [[2, "Shekar travels"]]];
    mock.onGet(`user/register-complaint/`).reply(200, data);

    render(<ComplaintForm />);

    const subjectTextbox = screen.getByPlaceholderText("Subject");
    fireEvent.change(subjectTextbox, {
      target: { value: "title" },
    });

    const descriptionTextbox = screen.getByPlaceholderText("Tell us the details of your issue.");
    fireEvent.change(descriptionTextbox, {
      target: { value: "ygdfugsdgf zgfcyuzgdfchsdvfc zxcdvgxdfvytscf zxcvbgdcftygscdvh" },
    });
    
    const adminRadio = screen.getByTestId("admin_radio");
    fireEvent.click(adminRadio);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    const busRadio = screen.getByTestId("bus_radio");
    fireEvent.click(busRadio);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);


  });
});
