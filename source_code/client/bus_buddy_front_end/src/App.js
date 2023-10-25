import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";


function App() {
  return (
   <Routes>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/delete-account" element={<DeleteAccountPage/>}></Route>
    <Route path="/change-password" element={<ChangePassword/>}></Route>
   </Routes>
  );
}

export default App;
