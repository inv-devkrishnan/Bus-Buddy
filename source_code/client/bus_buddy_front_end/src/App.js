import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import BusHome from "./components/Bus_Ui/BusHome";
import AddBus from './components/Bus_Ui/AddBus';
import DeleteBus from './components/Bus_Ui/DeleteBus';
import UpdateBus from './components/Bus_Ui/UpdateBus';
import ViewBus from './components/Bus_Ui/ViewBus';
import AddAmenities from './components/Bus_Ui/AddAmenities';
import UpdateAmenities from './components/Bus_Ui/UpdateAmenities'
import 'bootstrap/dist/css/bootstrap.css';
import Addroutes from './components/route_ui/Addroutes';
import Deleteroutes from './components/route_ui/Deleteroutes';
import ViewRoutes from './components/route_ui/ViewRoutes';
import LoginPage from "./pages/LoginPage";

import DeleteAccountPage from "./pages/DeleteAccount";

import ChangePassword from "./pages/ChangePassword";

import RegisterUser from "./pages/RegisterUser";

import RegisterOwner from "./pages/RegisterOwner";

import OwnerUpdateCard from "./components/OwnerUpdateCard";

import UpdateForm from "./components/UpdateFormCard";

import AdminDashboard from "./pages/AdminDashboard";
import UpdateOwnerProfile from './components/Bus_Ui/UpdateOwnerProfile';

function App() {
  return (
    <div>
          <React.Fragment>
            <Routes>
              <Route path='/' element={<BusHome/>}/>
              <Route path='/Addbus' element={<AddBus/>}/>
              <Route path='/Deletebus' element={<DeleteBus/>}/>
              <Route path='/Updatebus' element={<UpdateBus/>}/>
              <Route path='/Viewbus' element={<ViewBus/>}/>
              <Route path='/Addamenities' element={<AddAmenities/>}/>
              <Route path='/Updateamenities' element={<UpdateAmenities/>}/>
              <Route path='/Addroutes' element={<Addroutes/>}/>
              <Route path='/Deleteroutes' element={<Deleteroutes/>}/>
              <Route path='/ViewRoutes' element={<ViewRoutes/>}/>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/delete-account" element={<DeleteAccountPage />}></Route>
              <Route path="/change-password" element={<ChangePassword />}></Route>
              <Route path="/update-owner" element={<OwnerUpdateCard />} />
              <Route path="/register-owner" element={<RegisterOwner />} />
              <Route path="/register-user" element={<RegisterUser />} />
              <Route path="/update-user" element={<UpdateForm />} />
              <Route path="/Update-Profile" element={<UpdateOwnerProfile/>} />
              <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
            </Routes>
          </React.Fragment>
    </div>
  );
}

export default App;
