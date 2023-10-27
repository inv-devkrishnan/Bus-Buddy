import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
   <Routes>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/delete-account" element={<DeleteAccountPage/>}></Route>
    <Route path="/change-password" element={<ChangePassword/>}></Route>
    <Route path="/user-dashboard" element={<UserDashboard/>} />
   </Routes>
  );
}

export default App;
