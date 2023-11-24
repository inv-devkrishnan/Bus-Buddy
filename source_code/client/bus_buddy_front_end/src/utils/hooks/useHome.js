import { useNavigate } from "react-router-dom";
// hook used to navigate to landing page
export const useHome=()=> {
  const navigate = useNavigate();
  return () => {
    navigate("/"); 
  };
}
