import { useContext } from "react";
import { useState } from "react";
import { Authcontext } from "./context";
function Signup(){
const {register} = useContext(Authcontext);
 const [email,setemail] = useState('');
 const [password,setpassword] = useState('');
 const [username,setusername] = useState('');
   const handleSubmit = (e) => {
    e.preventDefault();
    register(username,email,password);
  }
    return <>
    <form onSubmit={handleSubmit} className="bg-cyan-950 flex flex-col items-center text-white p-2 gap-2 border-1 border- rounded-md h-screen w-full justify-center ">
      <div>
        <input type="text"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-5" placeholder="Username" name="username" value={username} onChange={(e)=>setusername(e.target.value)}/>
        <input type="email"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-5" placeholder="Email" name="email" value={email} onChange={(e)=>{ setemail(e.target.value);}} />
    <input type="password"  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 m-5" placeholder="pssword" name="password" value={password} onChange={(e)=>{ setpassword(e.target.value);}}/>
    <button type="submit" className="border-1 h-10 w-full bg-blue-500 shadow-md shadow-blue-500  rounded-md m-5">Signup</button>
    </div>
    </form>
    </>
}
export default Signup;