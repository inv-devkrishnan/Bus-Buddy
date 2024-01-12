import React from "react";
import {render,fireEvent,screen} from "@testing-library/react";
import NotFoundPage from "../pages/error_pages/NotFoundPage";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
  }));
describe('not found',()=>{
    test('render not found page', () => {
        render(<NotFoundPage/>);
        fireEvent.click(screen.getByText("Go Back to Home Page"))
      });

})
