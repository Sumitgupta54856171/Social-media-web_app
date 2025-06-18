import {Link} from "react-router-dom";
import {BookLock, GalleryThumbnails, Home,HomeIcon,ProjectorIcon,User, UserIcon} from 'lucide-react'
import Liveoption from "./Liveoption";
import { Authcontext } from "../context";
import { useContext } from "react";
function Navbar(){
    const {user} = useContext(Authcontext);
    const {handleclick} = useContext(Authcontext);
 
return(<> 
{user?
<nav className="flex w-full px-2 sm:px-3 py-2 fixed bottom-2 sm:bottom-4 justify-center z-50 text-black" onMouseLeave={handleclick}>
    
        <ul className=" backdrop-blur-md px-3 sm:px-4 py-2 rounded-full shadow-lg flex items-center gap-3 sm:gap-5 border border-white/10">
            <li>
               <Link to="/" className="flex flex-row items-center gap-1.5 text-black hover:text-white/80 hover:bg-white/10 rounded-full px-3 py-1.5 transition-all" ><span className="hidden sm:inline">Home</span><HomeIcon size={22}/></Link>
            </li>
            <li>
                <Link to="/search" className="flex flex-row items-center gap-1.5 text-black hover:text-white/80 hover:bg-white/10 rounded-full px-3 py-1.5 transition-all"><span>Search</span> <img src="https://cdn-icons-png.flaticon.com/128/54/54481.png" className="w-6 h-6"></img></Link>
            </li>
            <li>
            <Link to="/addpost" className="flex flex-row items-center gap-1.5 text-black hover:text-white/80 bg-pink-600 hover:bg-pink-700 rounded-full p-2.5 transition-all shadow-md"><img src="https://cdn-icons-png.flaticon.com/512/3161/3161837.png" className="w-6 h-6"></img></Link>
            </li>
            <li>
                <Link to="/stream" className="flex flex-row items-center gap-1.5 text-black hover:text-white/80 hover:bg-white/10 rounded-full px-3 py-1.5 transition-all"><span className="hidden sm:inline">Stream</span> <ProjectorIcon size={22}/></Link>
            </li>
            <li>
                <Link to="/chat" className="flex flex-row items-center gap-1.5 text-black hover:text-white/80 hover:bg-white/10 rounded-full px-3 py-1.5 transition-all"><span className="hidden sm:inline">chat</span><GalleryThumbnails size={22}/></Link>
            </li>
            <li>
                <Link to="/profile" className="flex flex-row items-center gap-1.5 text-black hover:text-white/80 hover:bg-white/10 rounded-full px-3 py-1.5 transition-all"><span className="hidden sm:inline">Profile</span><User size={22}/></Link>
            </li>

        </ul>
        
</nav>:<div>user login</div>
}
</>)
}
export default Navbar;