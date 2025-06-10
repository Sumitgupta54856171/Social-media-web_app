import { useContext } from "react";
import { Authcontext } from "../context";
import { useState } from "react";
import axios from "axios";

function Addstatus() {
    const {username} = useContext(Authcontext);

    const [image, setImage] = useState(null);
    function handleFileChange(e) {
        const file = e.target.files[0];
        setImage(file);
      }
    function handleSubmit(){
    const formData = new FormData();
    formData.append('image', image);
    formData.append('username',username);
    const response = axios.post('http://localhost:3003/api/addstatus',formData,{withCredentials: true})
    .then(()=>{
    console.log('success');
    })
   .catch((error)=>console.log(error))
    console.log(response);
    console.log('success');
    }
    
  
  return (
    <>
   
        <div
            className="flex flex-col cursor-pointer  relative w-16 h-16 rounded-full p-2 my-2 border-2 border-green-500 "
         >
            <input type="file" accept="image/*" onChange={handleFileChange} />
            
           </div>
           <button onClick={handleSubmit} className="w-12 h-5 bg-green-50">Upload Image</button>
        </>
  )
}
export default Addstatus;