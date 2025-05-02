import { useContext } from "react";
import { Authcontext } from "./context";
function Dashboard(){
    const {user,logout} =useContext(Authcontext);
  if(user){
    
  }
}
export default Dashboard;