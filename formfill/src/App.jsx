import Inputes from './Inputes';
import Signup from './Signup'; // Fixed typo in 'Singup'
import Home from './Home';
import Authentication from './Authentication';
import Postpage from './Postpage';
import AuthPorvider from './AuthPorvider';
import './index.css';
import {  Routes, Route} from 'react-router-dom';
import Homepage from './Homepage';
import AddPost from './component/AddPost';
import Post from './component/Post';
import Profile from './component/Profile';
function App() {
  return (
    <>
    <div className='bg-white'>
          <AuthPorvider>
          <Home></Home>
            <Routes>
              <Route path='/' element={<Homepage></Homepage>} />
              <Route path='/login' element={<Inputes />} />
              <Route path='/search' element={<Postpage />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/addpost' element={<AddPost />} />
              <Route path='/profile' element={<Profile />} />
            </Routes>
          </AuthPorvider>
    </div>         
    </>
  );
}

export default App;
