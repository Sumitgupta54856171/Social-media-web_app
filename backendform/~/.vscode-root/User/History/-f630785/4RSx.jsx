import { Link } from "react-router-dom";
import { useContext } from "react";
import { Authcontext } from "./context";

function Home() {
  const {user,logout} =  useContext(Authcontext);
  if(user){
    return <>
    <nav>
      <li>
        <button onClick={logout}>Logout</button>
      </li>
      <li>
        <Link to="/dashboard">dashboard</Link>
      </li>
    </nav>
    </>
  }else if (user === null){
    <>
    <nav>
      <li>
        <Link to="/login">Login</Link>
      </li>
      <li>
        <Link to="/signup">Signup</Link>
      </li>
      <li>
        <Link to="/dashboard">dashboard</Link>
      </li>
    </nav>
    </>
  }
 
}
export default Home;