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
    <form onSubmit={handleSubmit}>
        <input type="text"  placeholder="Username" name="username" value={username} onChange={(e)=>setusername(e.target.value)}/>
        <input type="email" placeholder="Email" name="email" value={email} onChange={(e)=>{ setemail(e.target.value);}} />
    <input type="password" placeholder="pssword" name="password" value={password} onChange={(e)=>{ setpassword(e.target.value);}}/>
    <button type="submit">Signup</button></form>
    </>
}
export default Signup;