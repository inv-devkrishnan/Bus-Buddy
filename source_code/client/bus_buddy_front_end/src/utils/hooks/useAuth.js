// hook to check wether user is logged in or not
import { useEffect, useRef } from "react";
export const useAuthStatus = () => {
  let authenticated = useRef(false);

  useEffect(() => {
    console.log(localStorage.getItem("token_expire_time"));
    if (localStorage.getItem("token_expire_time") !== null) {
      if (localStorage.getItem("token_expire_time") > Date.now()) {
        console.log("inside")
        authenticated.current = true;
      } else {
        authenticated.current = false;
      }
    }
  }, []);
  return authenticated;
};
