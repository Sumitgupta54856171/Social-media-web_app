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
     <form onSubmit={handleSubmit} className="border-0 w-full h-screen justify-center items-center flex flex-row bg-slate-900">
     <div className="border-0 flex flex-col rounded-md gap-4 w-full h-60 text-white">
        <input type="email" placeholder="Email" name="email" value={email} onChange={(e)=>{ setemail(e.target.value);}}  autoComplete="email" className="p-6 text-shadow-white"/>
    <input type="password" placeholder="pssword" name="password" value={password} onChange={(e)=>{ setpassword(e.target.value);}} autoComplete="current-password" className="p-6"/>
    <button type="submit" className="bg-cyan-500 shadow-lg shadow-cyan-500/50 boder-0 rounded-xl py-3 ">Login</button>  
    </div>
    </form>
   
    </>
}
export default Inputes;