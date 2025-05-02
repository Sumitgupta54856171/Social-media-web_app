const express= require('express');
const app = express();
const client = require('./config/db');
const conroller = require('./controller/login');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const cookie = require('cookie-parser');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
let transport  = nodemailer.createTrandsport({
	service:'gmail',
	auth:{
		user:"guptaashish2531@gmail.com",
		password:"7$Ashish",
	}
})
app.use(cookie());
app.use(session({
	secret: 'your_secret_key',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		secure: false, // Set to true if using HTTPS
		maxAge: 3600000 // 1 hour
	}
}));
app.use((req, res, next) => {

	res.locals.user = req.session.user || null;
	next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true 
  }))
app.use(bodyParser.urlencoded({extended:true}));

app.post('/login',conroller.login);
app.post('/register',conroller.register);

const port =3000;
app.listen(port,()=>{
	console.log(`server is running ${port}`);
	client;
})