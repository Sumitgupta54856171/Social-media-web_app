import {useState, useEffect} from "react";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { Authcontext } from "./context";

function AuthPorvider({children}){
    const [showstatu,setstatus] = useState(false);
    const [searhtu,setseachtu] = useState(false);
    const [searchdata,setsearchdata] = useState([]);
    const [user,setUser] =useState(false);
    const [username,setUsername] =useState(null);
    const [status,setStatus] = useState([]);
    const [error,serError]=useState('');
    const navigate = useNavigate();
    const [current,setCurrent] = useState();
   const  handleStatus=()=>{
        setstatus(!showstatu);
    }
     const [shownav,setShownav] = useState(false);
  function handleclick(){
    setShownav(!shownav);
  }
useEffect(()=>{
  const checkAuth = async ()=>{
  const response = await axios.get('http://localhost:3003/api/verify',{withCredentials: true});
  const userdata  = response.data.user;
  setCurrent(userdata);
 setUsername(userdata.username);
  if(userdata.username){
      setUser(true);
  }
  
}
checkAuth();
    },[]);
  useEffect(()=>{
  const getstatus = async ()=>{
        const response = await axios.get('http://localhost:3003/api/getstatus',{withCredentials:true});
        setStatus(response.data.statusdata1);
       
        }
getstatus()
  },[])  
    
 
 async function search(searchQuery){
    console.log('search start ')
    console.log(searchQuery)
    const response = await axios.post('http://localhost:3003/api/search', {
        username: searchQuery
    },{withCredentials:true});
    setsearchdata(response.data.searchdata)
    if(response.data.searchdata){
        setseachtu(true);
    }
    console.log(searhtu);
    return response.data.searchdata;
    }
    async function login(email,password){
        try {
            const res = await axios.post('http://localhost:3003/api/login', {
                email: email,
                password: password
            },{withCredentials: true});
            if (savedToken) {
                
            } else {
               
            }
            redirect('/')
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
        await axios.post('http://localhost:3003/api/register',userData,{withCredentials: true})
        navigate('/login');
    }

    function logout(){
        setUser(null);
        navigate('/');
    }

    return(
        <Authcontext.Provider value={{user,error,login,logout,register,username,status,showstatu,handleStatus,searchdata,search,handleclick,shownav,current}}>
            {children}
        </Authcontext.Provider>
    )
}

export default AuthPorvider;