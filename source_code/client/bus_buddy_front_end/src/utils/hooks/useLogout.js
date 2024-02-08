/* hook to logout any user and bring back to login page */
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../components/User/UserContext";
export const useLogout = () => {
  const navigate = useNavigate();
  const { updateFirstName } = useContext(UserContext);
  return () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
    updateFirstName(undefined);
  };
};
