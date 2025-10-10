import { useContext,useState } from "react";
import { Authcontext } from "./context";

function Inputes(){
 const {login} = useContext(Authcontext)
   const [email,setemail] = useState('');
    const [password,setpassword] = useState('');
    const handleSubmit = (e) => {
     e.preventDefault();
     login(email,password);
   }
    return <> 
     <form onSubmit={handleSubmit} className="space-y-2  w-screen h-full justify-center ">
     <div className="rounded-lg  border-slate-600  ">
        <input type="email" placeholder="Email" name="email" value={email} onChange={(e)=>{ setemail(e.target.value);}}  autoComplete="email"  className="w-full border rounded-md m-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
    <input type="password" placeholder="pssword" name="password" value={password} onChange={(e)=>{ setpassword(e.target.value);}} autoComplete="current-password" className="w-full border rounded-md m-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
    <button type="submit" className="bg-cyan-500 shadow-lg shadow-cyan-500/50 boder-0 rounded-xl py-3 w-screen">Login</button>
    </div>
    </form>
    
   
    </>
}
export default Inputes;