import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useEffect,useState } from 'react';
import axios from 'axios';
export default function AlignItemsList() {
   const [profile,setprofile] = useState('')
useEffect(()=>{
    const fetchprofile = async()=>{
        const response = await axios.get('http://localhost:3003/api/getprofile',{withCredentials: true})
        console.log('profile data is fetch')
        console.log(response.data)
        setprofile(response.data.profiledata[0].following)
        console.log(profile)
    } 
    fetchprofile();  
},[])
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary="Brunch this weekend?"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                sx={{ color: 'text.primary', display: 'inline' }}
              >
                Ali Connors
              </Typography>
              {" — I'll be in your neighborhood doing errands this…"}
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
}