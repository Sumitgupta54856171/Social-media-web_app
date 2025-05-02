import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Authcontext } from "./context";

function AuthPorvider({children}){
    const [user,setUser] =useState(null);
    const [error,serError]=useState('');
    const navigate = useNavigate();

    

    async function login(email,password){
       
        try {
            const res = await axios.post('http://localhost:3000/login', {
                email: email,
                password: password
            });
            console.log(email);
            setUser({email:email});
            console.log(res.data.token);
            const tokens = JSON.stringify(res.data.token);
            localStorage.setItem('token', tokens);
           
            // Check if the token is saved
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                console.log('Token saved successfully:', savedToken);
            } else {
                console.log('Failed to save token');
            }
           
            navigate('/');
           
        
        }catch(error){
            console.log(error);
            if(error.response && error.response.status === 401){
                serError('Invalid email or password');
            }else{
                serError('An error occurred. Please try again later.');
            }
          
        }
        
     
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
        localStorage.removeItem('token');
        navigate('/');
    }

    return(
        <Authcontext.Provider value={{user,error,login,logout,register}}>
            {children}
        </Authcontext.Provider>
    )
}

export default AuthPorvider;