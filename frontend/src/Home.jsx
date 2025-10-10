import { Link } from "react-router-dom";
import { useContext } from "react";
import { Authcontext } from "./context";
import Navbar from "./component/Navbar";

function Home() {
  const {user,logout} =  useContext(Authcontext);
 return <>
 <Navbar/>
 </>
 
}
export default Home;