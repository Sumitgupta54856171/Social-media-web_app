import Inputes from './Inputes';
import Signup from './Signup'; 
import Postpage from './Postpage';
import AuthPorvider from './AuthPorvider';
import './index.css';
import {  Routes, Route} from 'react-router-dom';
import Homepage from './Homepage';
import AddPost from './component/AddPost';
import Profile from './component/Profile';
import Chatlist from './component/Chatlist';
import Navbar from './component/Navbar';
import Shownav from './component/Shownav';
import { useContext } from 'react';
import WhatsAppClone from './component/WhatsAppClone';
import {Authcontext}  from './context';
import Chatbot from './component/Chatbot';
function App() {

  return (
    <>
    <div className='bg-white'>
          <AuthPorvider>
          <Shownav/>
          
            <Routes>
              <Route path='/' element={<Homepage></Homepage>} />
              <Route path='/login' element={<Inputes />} />
              <Route path='/search' element={<Postpage />} />
              <Route path='/signup' element={<Signup />} />
              <Route path='/addpost' element={<AddPost />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/chat' element={<Chatlist />} />
              <Route path='/whatsapp' element={<WhatsAppClone />} />
              <Route path='/chatbot' element={<Chatbot />} />
            </Routes>
          </AuthPorvider>
    </div>         
    </>
  );
}

export default App;
