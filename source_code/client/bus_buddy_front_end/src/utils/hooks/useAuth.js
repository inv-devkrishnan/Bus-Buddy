// hook to check wether user is logged in or not returns true if logged in else false
import { useRef } from "react";
export const useAuthStatus = () => {
  let authenticated = useRef(false);
  return () => {
    if (localStorage.getItem("token_expire_time") !== null) {
      if (localStorage.getItem("token_expire_time") > Date.now()) {
        authenticated.current = true;
      } else {
        authenticated.current = false;
      }
    }
    console.log("authenticated : " + authenticated.current);
    return authenticated.current;
  };
};
