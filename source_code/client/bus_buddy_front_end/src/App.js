import React from 'react';
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import BusHome from "./components/BusOwnerUi/BusHome";
import AddBus from './components/BusOwnerUi/Mybuses/AddBus';
import UpdateBus from './components/BusOwnerUi/Mybuses/UpdateBus';
import ViewBus from './components/BusOwnerUi/Mybuses/ViewBus';
import AddAmenities from './components/BusOwnerUi/Mybuses/AddAmenities';
import UpdateAmenities from './components/BusOwnerUi/Mybuses/UpdateAmenities';
import Addroutes from './components/BusOwnerUi/MyRoutes/Addroutes';
import Deleteroutes from './components/BusOwnerUi/MyRoutes/Deleteroutes';
import ViewRoutes from './components/BusOwnerUi/MyRoutes/ViewRoutes';
import LoginPage from "./pages/LoginPage";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";
import RegisterUser from "./pages/RegisterUser";
import RegisterOwner from "./pages/RegisterOwner";
import UserDashboard from "./pages/UserDashboard";
import OwnerUpdateCard from "./components/OwnerUpdateCard";
import UpdateOwnerProfile from './components/BusOwnerUi/UpdateOwnerProfile';
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import UpdateForm from './components/User/UpdateFormCard';
import Addtrips from './components/BusOwnerUi/MyTrips/Addtrips';

function App() {
  return (   
    <div>
          <Routes>
              <Route path='/' element={<LandingPage/>}/>
              <Route path='/BusHome' element={<BusHome/>}/>
              <Route path='/Addbus' element={<AddBus/>}/>
              <Route path='/Updatebus' element={<UpdateBus/>}/>
              <Route path='/Viewbus' element={<ViewBus/>}/>
              <Route path='/Addamenities' element={<AddAmenities/>}/>
              <Route path='/Updateamenities' element={<UpdateAmenities/>}/>
              <Route path='/Addroutes' element={<Addroutes/>}/>
              <Route path='/Deleteroutes' element={<Deleteroutes/>}/>
              <Route path='/ViewRoutes' element={<ViewRoutes/>}/>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/update-owner" element={<OwnerUpdateCard />} />
              <Route path="/register-owner" element={<RegisterOwner />} />
              <Route path="/register-user" element={<RegisterUser />} />
              <Route path="/update-user" element={<UpdateForm />} />
              <Route path="/Update-Profile" element={<UpdateOwnerProfile/>} />
              <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="view-trips" element={<ViewRoutes/>}/>
              <Route path="add-trips" element={<Addtrips/>}/>
            </Routes>
    </div>
  );
}

export default App;
