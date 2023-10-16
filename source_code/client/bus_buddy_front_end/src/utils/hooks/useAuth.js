// hook to check wether user is logged in or not
import {useRef } from "react";
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
    return authenticated;
  };
};
