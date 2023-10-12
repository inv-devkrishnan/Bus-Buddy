import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DeleteAccountPage from "./pages/DeleteAccountPage";


function App() {
  return (
   <Routes>
    <Route path="/login" element={<LoginPage/>}/>
    <Route path="/delete-account" element={<DeleteAccountPage/>}></Route>
   </Routes>
  );
}

export default App;
