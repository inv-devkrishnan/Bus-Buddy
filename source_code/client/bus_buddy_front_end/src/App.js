import React from "react";
import { Routes, Route } from "react-router-dom";
import ViewSeatDetails from "./pages/ViewSeatDetails";
import FullSleeperDetails from "./pages/AddSeatDetails/FullSleeperDetails";
import FullSeaterDetails from "./pages/AddSeatDetails/FullSeaterDetails";
import SingleSeaterDoubleSleeperDetails from "./pages/AddSeatDetails/SingleSeaterDoubleSleeperDetails";
import LoginPage from "./pages/LoginPage";
import DeleteAccountPage from "./pages/DeleteAccount";
import ChangePassword from "./pages/ChangePassword";
import { SeatContextProvider } from "./utils/SeatContext";

function App() {
  return (
    <SeatContextProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />}></Route>
        <Route path="/change-password" element={<ChangePassword />}></Route>

        <Route path="/" element={<FullSleeperDetails />} />
        <Route path="/full-seater-details" element={<FullSeaterDetails />} />
        <Route
          path="/single-seater-double-sleeper-details"
          element={<SingleSeaterDoubleSleeperDetails />}
        />

        <Route path="/view-seats" element={<ViewSeatDetails />} />
      </Routes>
    </SeatContextProvider>
  );
}

export default App;
