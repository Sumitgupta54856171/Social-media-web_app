import { Link } from "react-router-dom";
import { useContext } from "react";
import { Authcontext } from "./context";
function Home() {
  const {user,logout} =  useContext(Authcontext);
  if(user){
    return <>
    <nav className=" fixed top-0 left-0 h-screen w-10 bg-slate-900 text-white shadow-2xl flex flex-col  rounded-r-lg ">
      <ul className="flex flex-col">
      <li className="border-2 border-slate-900 bg-slate-300 shadow-2xl shadow-slate-900 justify-center items-center rounded-md gap-y-5">
        <button onClick={logout} className=""><img src="https://cdn-icons-png.flaticon.com/512/3580/3580168.png" alt="" className="size-4 " /> </button>
      </li>
      <li className="border-2 border-slate-900 bg-slate-300 shadow-2xl shadow-slate-900 justify-center items-center rounded-md gap-y-5">
        <Link to="/dashboard" className=""><img src="https://cdn-icons-png.flaticon.com/512/4757/4757881.png" alt="" className="size-4"/></Link>
      </li>
      <li className="border-2 border-slate-900 bg-slate-300 shadow-2xl shadow-slate-900 justify-center items-center rounded-md gap-y-5">
        <Link className=""> <img src="https://cdn-icons-png.flaticon.com/512/4146/4146794.png" alt="" className="size-4"/></Link>
      </li>
      </ul>
    </nav>
    </>
  }else if(user == null){
    
   return <> 
    <nav className=" fixed top-0 left-0 h-screen w-10 bg-slate-900 text-white shadow-2xl flex flex-col  rounded-r-lg ">
      <ul className="flex flex-col ">
      <li className="border-2 border-slate-900 bg-slate-300 shadow-2xl shadow-slate-900 justify-center items-center rounded-md gap-y-5">
        <Link to="/" className=""><img src=" https://cdn-icons-png.flaticon.com/512/1946/1946488.png" alt="Login" /></Link>
      </li>
      <li className="border-2 border-slate-900 bg-slate-300 shadow-2xl shadow-slate-900 justify-center items-center rounded-md gap-y-5">
        <Link to="/login" className=""><img src="   https://cdn-icons-png.flaticon.com/512/7856/7856337.png " alt="Login" /></Link>
      </li>
      <li className="border-2 border-slate-500 bg-slate-300 shadow-2xl shadow-slate-900 justify-center items-center ">
        <Link to="/signup" className="nav-icon"><img src="   https://cdn-icons-png.flaticon.com/512/684/684831.png " alt="Sign" /></Link>
      </li>
      </ul>
    </nav>
    </>
  }
 
}
export default Home;