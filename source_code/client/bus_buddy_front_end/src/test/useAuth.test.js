import { renderHook } from "@testing-library/react-hooks";
import { useAuthStatus } from "../utils/hooks/useAuth"; // Adjust the import path accordingly

// Mock localStorage for the test


test("useAuthStatus returns true when the user is logged in", () => {
  let time = Date.now() + 1000000;
  localStorage.setItem("token_expire_time",time.toString()); // Set to a future time
  renderHook(() => useAuthStatus());
});

test("useAuthStatus returns false when the user is not logged in", () => {
  let oldtime = Date.now() - 1000000;
  localStorage.setItem("token_expire_time",oldtime.toString()); // Set to a past time
  // Call the hook
  renderHook(() => useAuthStatus());
});
