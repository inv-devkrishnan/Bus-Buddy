import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard"
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/change-password" element={<ChangePassword />}></Route>
      <Route path="/user-dashboard" element={<UserDashboard/>} />    
    </Routes>
  );
}

export default App