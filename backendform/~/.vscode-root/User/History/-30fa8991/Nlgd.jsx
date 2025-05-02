import {useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "./context";
function AuthPorvider({children}){
    const [user,setUser] =useState({});
    const [error,serError]=useState('');
    const navigate = useNavigate();
   async function login(email,password){
     const res= await axios.post('http://localhost:3000/login',{
        email:email,
        password:password
      });
      setUser({email:email})
      console.log(email);
      navigate('/');
      localStorage.setItem("token", res.data.token);
     
    }
    async function register(username,email,password){
     const userData = {
        username: username,
        email: email,
        password: password
      }
      console.log(userData);
       await axios.post('http://localhost:3000/register',userData,)
      navigate('/login');
       
    }
    function logout(){
        setUser(null);
        navigate('/');
    }
    return(
        <Authcontext.Provider value={{user,error,login,logout,register}}>
            {children}
        </Authcontext.Provider>
    )
 }
 export default AuthPorvider;