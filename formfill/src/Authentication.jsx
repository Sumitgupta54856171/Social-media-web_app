import { useContext } from "react";
import { Authcontext } from "./context";
import {Navigate} from "react-router-dom";
function Authentication({ children }) {
    const { user } = useContext(Authcontext);
  return (
    user ? (
      <div>
        {children}
      </div>
    ):(
        <Navigate to="/login"  />
    )
  );
}
export default Authentication;