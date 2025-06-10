import { useContext } from "react";
import { Authcontext } from "../context";
import Showpost from "./showpost";
const Staturing = () => {
    const {username,status,showstatu,handleStatus} = useContext(Authcontext);
    
    
    
  console.log('showstatus data');

    return (
        <>
    
        <div
        className="flex flex-col cursor-pointer p-2 relative"
        onClick={handleStatus}>
        <div className=" w-16 h-16 rounded-full items-center justify-center border-2 border-green-500 p-0.5 ">
            <img
                src={`http://localhost:3001/uploads/${username.username}`}
                alt={username.username}
                className="w-full h-full rounded-full object-cover"
            />
        </div>
        <span className="mt-2 text-sm text-gray-700 font-medium">{username}</span>
    </div>
  
 {showstatu && <Showpost></Showpost>}
 </>
    )
};
export default Staturing;