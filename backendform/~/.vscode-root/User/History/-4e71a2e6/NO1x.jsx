import { useContext } from "react";
import { Authcontext } from "./context";
function Dashboard(){
    const {user,logout} =useContext(Authcontext);
  if(user){
    return <>
    <h1>{user.email}</h1>
    </>
  }
}
export default Dashboard;