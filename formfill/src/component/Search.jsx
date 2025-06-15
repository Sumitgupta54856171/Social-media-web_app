import { useContext,useState } from "react";
import { Authcontext } from "../context";
function Search(){
    const [user,usrdata] =useState('')
const {search,searhtu} =useContext(Authcontext)


  function  handlsearch(e){
    e.preventDefault();
    search(user);
  }
     return(
        <>
        <div className="flex items-center gap-2">
            <input type="text" className="border border-gray-300 rounded-md p-2" placeholder="Search" value={user} onChange={(e)=>usrdata(e.target.value)} />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={handlsearch}>Search</button>
        </div>
      
        </>
    )
}
export default Search;