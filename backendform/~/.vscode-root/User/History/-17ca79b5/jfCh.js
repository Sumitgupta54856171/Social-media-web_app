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

app.post('/login',conroller.login);
app.post('/register',conroller.register);

const port =3000;
app.listen(port,()=>{
	console.log(`server is running ${port}`);
	client;
})