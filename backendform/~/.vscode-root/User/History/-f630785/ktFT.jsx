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
  }else{
    <>
    <nav>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </nav>
    </>
  }
  return <>
  <h1>welcome to home</h1>

  </>
}
export default Home;