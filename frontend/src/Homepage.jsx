import {Link} from "react-router-dom";
import { Authcontext } from "./context";
import { useContext } from "react";
import Staturing from "./component/Staturing";

import Addstatus from "./component/Addstatus";
import Post from "./component/Post";
function Homepage(){
    const {user,username} =useContext(Authcontext);
    console.log(username);
    
    return(<>
  <div className="bg-gray-100 w-full min-h-screen">
    <nav className="bg-slate-800 text-white p-4">
        {user ? <p></p>: <ul className="flex justify-end space-x-4">
                <li>
                    <Link to="/login" className="hover:text-blue-300">Login</Link>
                </li>
                <li>
                    <Link to="/signup" className="hover:text-blue-300">Signup</Link>
                </li>
            </ul>}
           </nav>
            <div className="container mx-auto p-4"> <div className="flex flex-col md:flex-row gap-8">
           <div className="w-full w-fll">
           {user && <Addstatus></Addstatus>}
           {user && <Staturing ></Staturing>}
           </div>
           <div className="w-full md:w-3/4"> {user && <Post></Post>}
           </div></div></div>
    </div>
    </>)
}
export default Homepage;