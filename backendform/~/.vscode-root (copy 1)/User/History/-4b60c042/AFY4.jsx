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
    return <> <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" name="email" value={email} onChange={(e)=>{ setemail(e.target.value);}} />
    <input type="password" placeholder="pssword" name="password" value={password} onChange={(e)=>{ setpassword(e.target.value);}}/>
    <button type="submit">Login</button> </form>
    </>
}
export default Inputes;