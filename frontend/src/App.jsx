import Inputes from './Inputes';
import Signup from './Signup'; 
import Postpage from './Postpage';
import AuthPorvider from './AuthPorvider';
import './index.css';
import {  Routes, Route} from 'react-router-dom';
import Homepage from './Homepage';
import AddPost from './components/AddPost';
import Profile from './components/Profile';
import Chatlist from './components/Chatlist';
import Navbar from './components/Navbar';
import Shownav from './components/Shownav';
import Chatbot from './components/Chatbot';
import WhatsAppStatus from './components/StatuV1';
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
              <Route path='/chatbot' element={<Chatbot />} />
              <Route path="/status/v1" element={<WhatsAppStatus/>}></Route>
            </Routes>
          </AuthPorvider>
    </div>         
    </>
  );
}

export default App;
