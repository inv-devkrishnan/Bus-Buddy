import { Outlet } from "react-router-dom";
import BusNavBar from "./BusNavBar";

export const NavbarLayout = () => (
  <div>
    <BusNavBar />
    <Outlet/>
  </div>
);
