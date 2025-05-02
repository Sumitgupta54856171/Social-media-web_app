import { useContext } from "react";
import { Authcontext } from "./context";
function Dashboard(){
    const {user,logout} =useContext(Authcontext);
  if(user){
    return <>
    <h1>{user.email}</h1>
    <h1>welcome to user</h1>
    <button onClick={logout}>Logout</button>
    </>
  }
  return <>
  <h1>please login</h1>
  </>

}
export default Dashboard;