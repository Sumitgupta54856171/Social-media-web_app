import { Link } from "react-router-dom";
import { useContext } from "react";
import { Authcontext } from "./context";

function Home() {
  const {user,logout} =  useContext(Authcontext);
  if(user)
  return <>
  <h1>welcome to home</h1>
  {(user ? (
   <div>
     <h1>Welcome {user}</h1>
     <button onClick={logout}>Logout</button>
   </div>
  )
 : 
  (<div>
      <nav>
        <li>
          <Link to="/login">login</Link>
        </li>
        <li>
          <Link to="/signup">singup</Link>
        </li>
        <li>
          <Link to="dashboard">dashboard</Link>
        </li>
      </nav>
      <h1>Please login to access this page</h1>
    </div>
     
  ))}
  </>
}
export default Home;