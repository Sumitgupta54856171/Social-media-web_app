import {Link} from "react-router-dom";
import {BookLock, GalleryThumbnails, Home,HomeIcon,ProjectorIcon,User, UserIcon} from 'lucide-react'
import Liveoption from "./Liveoption";
import { Authcontext } from "../context";
import { useContext,useState } from "react";
function Navbar(){
    const {user} = useContext(Authcontext);
 
return(<> 
{user?


<nav className="flex  w-full px-3 py-3 fixed   bottom-4 justify-center">
    
        <ul className="bg-slate-700 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-5 border border-white/10">
            <li>
               <Link to="/" className="flex flex-row gap-1 hover:text-white/70 hover:bg-white/10 hover:border hover:rounded-2xl hover:px-2" ><p>Home</p><HomeIcon size={20}/></Link>
            </li>
            <li>
                <Link to="/profile" className="flex flex-row gap-1 hover:text-white/70 hover:bg-white/10 hover:border hover:rounded-2xl hover:px-2"><p>Post</p> <UserIcon size={20}/></Link>
            </li>
            <li>
            <Link to="/profile" className="flex flex-row gap-1 hover:text-white/70 hover:bg-white/10 hover:border hover:rounded-2xl hover:px-2"><p>Add Post<img src="   https://cdn-icons-png.flaticon.com/512/3161/3161837.png " className="size-12"></img></p></Link>
            </li>
            <li>
                <Link to="/profile" className="flex flex-row gap-1 hover:text-white/70 hover:bg-white/10 hover:border hover:rounded-2xl hover:px-2"><p>Chat</p> <UserIcon size={20}/></Link>
            </li>
            <li>
                <Link to="/blog" className="flex flex-row gap-1 hover:text-white/70 hover:bg-white/10 hover:border hover:rounded-2xl hover:px-2"><p>Gallery</p><BookLock size={20}/></Link>
            </li>
            <li>
                <Link to="/gallery" className="flex flex-row gap-1 hover:text-white/70 hover:bg-white/10 hover:border hover:rounded-2xl hover:px-2"><p>Profile</p><GalleryThumbnails size={20}/></Link>
            </li>

        </ul>
        
</nav>:<div>user login</div>
}
</>)
}
export default Navbar;