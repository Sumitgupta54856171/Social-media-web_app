import { useContext } from "react";
import { Authcontext } from "../context";
import Showpost from "./showpost";
const Staturing = () => {
    const {username,status,showstatu,handleStatus} = useContext(Authcontext);
    
    
    
  console.log('showstatus data');

    return (
        <>
    
        <div
        className="flex items-center space-x-4 cursor-pointer p-2 relative rounded-lg hover:bg-gray-200 transition-colors"
        onClick={handleStatus}>
          <div className="flex-shrink-0">
            <img
               src={`https://placehold.co/64x64/FF5A5F/ffffff?text=${username.charAt(0).toUpperCase()}`}
              alt={`${username}'s profile`}
              className="w-16 h-16 rounded-full object-cover border-2 border-pink-500 shadow-md"
            />
          </div>
        <span className="text-sm text-gray-800 font-medium">{username}</span>
    </div>
  
 {showstatu && <Showpost></Showpost>}
 </>
    )
};
export default Staturing;