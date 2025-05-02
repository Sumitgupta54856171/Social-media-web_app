import { Link } from "react-router-dom";
import { useContext } from "react";
import { Authcontext } from "./context";

function Home() {
  const {user,logout} =  useContext(Authcontext);
  if(user){
    return <>
    <nav>
      <li>
        <Link to="/"></Link>
      </li>
    </nav>
    </>
  }
  return <>
  <h1>welcome to home</h1>

  </>
}
export default Home;