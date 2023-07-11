const express=require('express');
const app=express();
const dotenv= require ('dotenv');
dotenv.config({path:'./config.env'});
const router=express.Router();
const productrouter=require('./views/routes/product');
const userrouter= require('./views/routes/user');
const bodyParser=require('body-parser');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');
const PORT=process.env.PORT;
const con=require('./views/connection');
//////////////////////////////////////////////////////////

app.set('view engine','ejs');
app.use(express.static('views'));
app.use(bodyParser.urlencoded({extended:true}));    
app.use(cookieParser('secretkeyforcookies'));
app.use(session({
    secret:'secretkeyforcookies',
    cookie:{maxAge:60000},
    resave:true,
    saveUninitialized:true
}));
app.use(flash());



app.use('/',router);
app.use('/',productrouter);
app.use('/',userrouter);


app.listen(PORT,()=>{
    console.log(`server is running at port no ${PORT}`);
})