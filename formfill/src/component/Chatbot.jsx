import { useContext,useEffect,useState } from 'react';
import { Authcontext } from '../context';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';
import axios from 'axios';
function Chatbot(){
    const {current,username} = useContext(Authcontext);
    const [currentUser, setCurrentUser] = useState({ 
        _id:current, 
        username:username, 
        avatar: '👤' 
    });
    const [users, setUsers] = useState([]);
    useEffect(()=>{
        const Userlist = async()=>{
            const res = await axios.get('http://localhost:3003/api/getuser',{withCredentials:true})
            console.log(res.data.userlist2)
            const users = res.data.userlist2
            setUsers(users)
        }
        Userlist()
    },[])
    return(
        <div>
            {users.map(user=>(
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={user.username} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={user.username}
          secondary={
        
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                {user.username}
              </Typography>
            
            
          }
        />
      </ListItem>
      </List>
            ))}
        </div>
    )
}
export default Chatbot;
