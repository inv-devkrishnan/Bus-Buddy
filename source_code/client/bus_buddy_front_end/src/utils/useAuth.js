import { useEffect, useRef} from "react";

export function useAuthStatus() {
  let authenticated = useRef(true)

  useEffect(() => {
    console.log(localStorage.getItem("loggedIn"))
    if (localStorage.getItem("loggedIn")==="1") {
      console.log("inside")
      authenticated.current =true
    
    } else {
      authenticated.current = false
    }
  }, []);
  return authenticated;
}
