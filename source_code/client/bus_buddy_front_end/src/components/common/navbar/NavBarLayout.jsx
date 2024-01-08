import { Outlet } from "react-router-dom";
import BusNavBar from "./BusNavBar";

export const NavbarLayout = () => (
  // function to display navbar and its children
  <div>
    <BusNavBar/>
    <div style={{marginBottom:"56px"}}></div>
    <Outlet/>
  </div>
);
