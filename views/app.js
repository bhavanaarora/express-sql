const express=require('express');
const app=express();
const dotenv= require ('dotenv');
dotenv.config({path:'./config.env'});
const router=express.Router();
const productrouter=require('./routes/product');
const userrouter= require('./routes/user')
const bodyParser=require('body-parser');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');
const PORT=process.env.PORT;
const con=require('./connection');
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


// app.use((req,res,next)=>{
//     if(req.cookies.userid && !req.session.user){
//         res.clearCookie('userid');
//     }
//     next();
// })




//////////////////////////////////////////////////////////////////
//middleware function to check for loggedin user

// var sessionChecker=(req,res,next)=>{
//     if(req.cookie,userid && !req.session.user){
//         console.log('id does not match');
//         res.redirect('/login');
//     }
//     else{
//         next();
//     }
// };


// router.get('/',(req,res)=>{
//     res.render('./dashboard');
// })
//////////////////////////////////////////////////////////////

app.use('/',router);
app.use('/',productrouter);
app.use('/',userrouter);


app.listen(PORT,()=>{
    console.log(`server is running at port no ${PORT}`);
})