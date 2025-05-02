import { useContext } from "react";
import { Authcontext } from "./context";
function Dashboard(){
    const {user,logout} =useContext(Authcontext);
  return (
   <>
   <div>
    welcome, {user.email}!
   </div>
   <button onClick={logout}>logout</button>
   </>
  )
}
export default Dashboard;