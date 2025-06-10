import Inputes from './Inputes';
import Signup from './Signup'; // Fixed typo in 'Singup'
import Home from './Home';
import Authentication from './Authentication';
import Dashboard from './Dashboard'; // Fixed typo in 'dashboard'
import AuthPorvider from './AuthPorvider';
import './index.css';
import {  Routes, Route} from 'react-router-dom';
import Homepage from './Homepage';
function App() {
  return (
    <>
          <AuthPorvider>
          <Home></Home>
            <Routes>
              <Route path='/' element={<Homepage></Homepage>} />
              <Route path='/login' element={<Inputes />} />
              <Route path='/signup' element={<Signup />} />
              <Route
                path='/dashboard'
                element={
                  <Authentication>
                    <Dashboard />
                  </Authentication>
                }
              />
            </Routes>
          </AuthPorvider>
         
     
        
    </>
  );
}

export default App;
