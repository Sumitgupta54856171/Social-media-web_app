const express= require('express');
const app = express();
const client = require('./config/db');
const conroller = require('./controller/login');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:5173', // Explicitly allow your React app
	credentials: true // If using cookies/auth
  }))
app.use(bodyParser.urlencoded({extended:true}));
app.get('/',(req,res)=>{
	console.log(req.url);
	res.sendFile(path.join(__dirname,'/views/howe.html'));
})
app.get('/login',(req,res)=>{
	res.sendFile(path.join(__dirname,'/views/login.html'));
}
)
app.get('/register',(req,res)=>{
	res.sendFile(path.join(__dirname,'/views/registion.html'));
}
)

app.post('/login',(conroller.login()))
app.post('/register',(conroller.register()))

app.post('/logout',(req,res)=>{
	conroller.logout();
	res.send('Logout successful');
}
)
const port =3000;
app.listen(port,()=>{
	console.log(`server is running ${port}`);
	client;
})