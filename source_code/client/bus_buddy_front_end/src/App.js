import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";
import UserDashboard from "./pages/UserDashboard";
import RegisterUser from "./pages/RegisterUser";
import RegisterOwner from "./pages/RegisterOwner";
import OwnerUpdateCard from "./components/OwnerUpdateCard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/delete-account" element={<DeleteAccountPage />}></Route>
      <Route path="/change-password" element={<ChangePassword />}></Route>
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/update-owner" element={<OwnerUpdateCard />} />
      <Route path="/register-owner" element={<RegisterOwner />} />
      <Route path="/register-user" element={<RegisterUser />} />
    </Routes>
  );
}

export default App;
