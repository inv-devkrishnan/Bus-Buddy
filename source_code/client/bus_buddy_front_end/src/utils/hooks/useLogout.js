/* hook to logout any user and bring back to login page */
import { useNavigate } from "react-router-dom";
export const useLogout=()=> {
  const navigate = useNavigate();
  return () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login"); //clears previous history
  };
}
