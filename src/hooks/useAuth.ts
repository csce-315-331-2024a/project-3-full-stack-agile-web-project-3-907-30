import { useContext } from "react";
import { AuthContext } from "../context/authContext";

/**
 * @returns {AuthHookType} The auth context
 */
export default function useAuth() {
  return useContext(AuthContext);
}
