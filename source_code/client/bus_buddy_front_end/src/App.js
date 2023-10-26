import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";
import OwnerUpdateCard from "./components/OwnerUpdateCard";
import OwnerRegisterCard from "./components/OwnerRegisterCard";
import RegisterCard from "./components/RegisterCard";
import UpdateForm from "./components/UpdateFormCard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
   <Routes>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/delete-account" element={<DeleteAccountPage/>}></Route>
    <Route path="/change-password" element={<ChangePassword/>}></Route>
    <Route path="/user-dashboard" element={<UserDashboard/>} />
    <Route path="/update-owner" element={<OwnerUpdateCard />} />
      <Route path="/register-owner" element={<OwnerRegisterCard />} />
      <Route path="/register-user" element={<RegisterCard />} />
      <Route path="/update-user" element={<UpdateForm />} />
   </Routes>
  );
}

export default App;
