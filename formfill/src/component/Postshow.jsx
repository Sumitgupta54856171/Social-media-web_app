import { Avatar } from '@mui/material';
import Stack from '@mui/material/Stack';
import { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
function Postshow(){
  const [like,setlike] = useState(false)
  const [comment,setcomment] = useState('')
  const [count,setcount] = useState(1247);
 
    return <>
    <div className="bg-white rounded-lg shadow-md p-4 max-w-md mx-auto">
        <header className="flex items-center mb-4">
            <Stack direction="row" spacing={2}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              </Stack>
              <h1 className="font-semibold ml-3">username</h1>
        </header>
        <main>
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=500&fit=crop" alt="" className="w-full rounded-lg mb-4"/>
            <div className='flex items-center gap-4 mb-4'>
                <button onClick={()=>{setlike(!like)}} className={`${like ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}>
                    <Heart className={`w-7 h-7 ${like ? 'fill-current' : ''}`} />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <MessageCircle className="w-7 h-7" />
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                    <Send className="w-7 h-7" />
                </button>
            </div>
            <footer className="flex gap-2">
               <input type="text" value={comment} onChange={(e)=>setcomment(e.target.value)} placeholder="Add a comment..." className='flex-grow h-10 border rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-400'/>
               <button className='bg-blue-500 text-white font-semibold px-6 rounded-full hover:bg-blue-600 transition-colors disabled:bg-blue-300' disabled={!comment.trim()}>Send</button>
            </footer>
        </main>
    </div>
    </>
}
export default Postshow;