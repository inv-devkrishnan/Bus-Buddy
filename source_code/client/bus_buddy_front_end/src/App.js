import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";
import { SeatContextProvider } from "./utils/SeatContext";
import ViewSeatDetails from "./pages/ViewSeatDetails";

function App() {
  return (
    <SeatContextProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />}></Route>
        <Route path="/change-password" element={<ChangePassword />}></Route>
        <Route path="/view-seats" element={<ViewSeatDetails/>} />
      </Routes>
    </SeatContextProvider>
  );
}

export default App;
