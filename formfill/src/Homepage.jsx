import {Link} from "react-router-dom";
import { Authcontext } from "./context";
import { useContext } from "react";
import Staturing from "./component/Staturing";

import Addstatus from "./component/Addstatus";
function Homepage(){
    const {user,username} =useContext(Authcontext);
    console.log(username);
    
    return(<>
   
  <div className="bg-slate-900 w-full h-screen">
 
  {user?null:  <nav className="bg-slate-600 w-20 h- 10 border border-b-gray-950 p-6">
            <ul>
                <li className="hover:bg-green-500 hover:border-red-300 hover:rounded-b-sm w-10 h-full">
                    <Link to="/login">login</Link>
                </li>
                <li className="hover:bg-red-500 hover:border-1 hover:border-red-300 hover:rounded-b-sm w-12 h-full">
                    <Link to="/signup">signup</Link>
                </li>
            </ul></nav>}
            <div className="flex flex-row">
           {user && <Addstatus></Addstatus>}
           {user && <Staturing ></Staturing>}
          
    </div>
    <h1>welcome home</h1>
   
    </div>
    </>)
}
export default Homepage;