const express= require('express');
const app = express();
require('dotenv').config();
const redis = require('./config/redis')
const client = require('./config/db');
const conroller = require('./controller/login');
const cors = require('cors');
const path = require('path');
const uploads = require('./controller/Uploads');
const session = require('express-session');
const cookie = require('cookie-parser');
const dbs = require('./config/postgresql');
const jwtverify =require('./controller/jwt');
const Status = require('./controller/Status')
app.use(cookie());
app.use(session({
	secret: 'your_secret_key',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		secure: false, // Set to true if using HTTPS
		maxAge: 60*60*24*1000*7
	}
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods:["POST","GET","DEL","PUT"]
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/api/getstatus',Status.getStatus);
app.get('/api/verify',jwtverify.verifyToken)
app.post('/api/login',conroller.login);
app.post('/api/register',conroller.register);
app.post('/api/addstatus',uploads.single('image'),Status.addstatus);

const port =3003;
app.listen(port,()=>{
	console.log(`server is running ${port}`);
	client;
		redis;
		dbs;
})