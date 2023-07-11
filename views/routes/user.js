const express = require('express');
const router = express.Router();
const con = require('../connection');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');

//////////////////////////////////////////////
router.get('/dashboard', (req, res) => {

    res.render('dashboard', { title: 'Express', session: req.session });
})

////////////////////////////////////////////////////////////////

router.get('/',(req,res)=>{
    res.render('index');
})

////////////////////////////////////////////////

//get signup

router.get('/user', (req, res) => {
    const username = req.flash('user');
    const username2 = req.flash('user2');
    const data = req.flash('data');
    res.render('user', { title: 'Express', session: req.session, username, username2, data });

})



//post signup
router.post('/adduser', (req, res) => {


    let phoneno = /^\d{10}$/;
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!(req.body.mobile.match(phoneno) && req.body.email.match(mailformat))) {

        req.flash('data', true);
        console.log('Plz Enter Correct Details:');
        res.redirect('/user');
    }
    else {


        let { id, firstname, lastname, email, mobile } = req.body;
        let password = bcrypt.hashSync(req.body.password, 10);
        console.log(password);



        let qry, qry2;

        qry = "select email,mobile from user where email=? or mobile=?";
        con.query(qry, [email, mobile], (err, result) => {
            if (err) throw err;
            else if (result.length > 0) {
                console.log("user already exist");
                req.flash('user2', result.length);
                res.redirect('/user');
            } else {

                qry2 = "insert into user values(?,?,?,?,?,?)";
                con.query(qry2, [id, firstname, lastname, email, password, mobile], (err, result) => {
                    if (err) throw err;
                    else {
                        req.flash('user', req.body.firstname);
                        console.log(result);
                        res.redirect('user');
                    }
                })

            }
        })


    } //else end

})

//////////////////////////////////////////////////////////////////
//login:get
router.get('/login', (req, res) => {

    //let msg = req.flash('data');
    let msg=req.flash('msg1')
    let msg2=req.flash('msg2')
    let msg3=req.flash('msg3')
    res.render('login', { msg,msg2,msg3 });
})

///////////////////////////////////////////////////////////////////////

//login post with session

router.post('/login', (req, res) => {

    let { email, password } = req.body;
    if (email && password) {

        let qry;
        qry = "select * from user where email=?";
        con.query(qry, [email], (err, data) => {
            if (err) throw err;
            console.log(data);
            
            if (data.length > 0) {
                for (let count = 0; count < data.length; count++) {
                    const status = bcrypt.compareSync(req.body.password.toString(), data[count].password)
                    console.log(status);
                    if (status) {
                        req.session.userid = data[count].firstname;
                        console.log('successfully login');
                        res.redirect('/dashboard');
                    }
                    else {
                        let msg3='true'
                        req.flash('msg3',msg3);
                        res.redirect('/login');
                        console.log(err + 'incorrect password');
                       
                    }

                }//for close

            }//if close
            else {
                let msg2='true'
                req.flash('msg2',msg2);
                res.redirect('/login');
                console.log('incorrect credentials');
            }
            res.end();
        })

    } else {
        let msg1='true'
        req.flash('msg1',msg1);
        res.redirect('/login');
        console.log('please enter email address and password');
        res.end();

    }

})

////////////////////////////////////////////////////////////////////
//post signup with promise
router.post('/adduser', async (req, res) => {
    let phoneno = /^\d{10}$/;
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!(req.body.mobile.match(phoneno) && req.body.email.match(mailformat))) {

        req.flash('data', true);
        console.log('Plz Enter Correct Details:');
        res.redirect('/user');
    }

    else {
        let { id, firstname, lastname, email, mobile } = req.body;
        //bcrypt password
        let password = bcrypt.hashSync(req.body.password, 10);
        console.log(password);


        try {
            const result = await new Promise((resolve, reject) => {

                let qry;
                qry = 'insert into user values(?,?,?,?,?,?)';
                con.query(qry, [id, firstname, lastname, email, password, mobile], (err, results) => {
                    if (err) return reject(err);
                    return resolve(results);

                })


            })

            //do stuff with const result

            console.log(result);
            req.flash('user', req.body.firstname);
            res.redirect('/user');

        }//try:end

        catch (err) {
            console.log(err);

        }
    }


})
//////////////////////////////////////////////////////////////////////
router.get('/viewuser',(req,res)=>{
    let qry;
    qry='select * from user';
    con.query(qry,(err,data)=>{
        if(err) throw err;
        else{
            console.log(data);
            res.render('viewuser',{ title: 'Express', session: req.session,data });
        }
    })
   
})

///////////////////////////////////////////////////////////////////////////////

router.get('/delete/:id',(req,res)=>{
    let id= req.params.id;
    let qry;
    qry='delete from user where id=?';
    con.query(qry,[id],(err,result)=>{
        if(err) throw err;
        else{
            if(result.affectedRows > 0){
                console.log('data deleted');
                res.redirect('/viewuser');

            }else{
                console.log('data can not be deleted');
            }
        }
    })
})

////////////////////////////////////////////////////////////////////////////////

router.get('/edit/:id',(req,res)=>{
    let id =req.params.id;
    let qry;
    qry="select * from user where id=?";
    con.query(qry,[id],(err,data)=>{
        if(err) throw err;
        else {
            if(data.length > 0){
                res.render('edit',{data});
                console.log(data);

        }else{
            console.log('no record found');
        }
    }
    })

})
////////////////////////////////////////////////////////////////////////////////
router.post('/edit/:id',(req,res)=>{
    let id=req.params.id;
   let {firstname,lastname,email,mobile}=req.body;
   let qry;
   qry='update user set firstname=?,lastname=?,email=?,mobile=? where id=?';
   con.query(qry,[firstname,lastname,email,mobile,id],(err,result)=>{
    if(err) throw err;
    else{
        if(result.affectedRows > 0){
            console.log('record updated');
            res.redirect('/viewuser');

        }else{
            console.log('no record found');
        }
    }
   })
})






////////////////////////////////////////////////////////////////////////////

//post signup with callback function
router.post('/adduser', (req, res) => {


    let phoneno = /^\d{10}$/;
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!(req.body.mobile.match(phoneno) && req.body.email.match(mailformat))) {

        req.flash('data', true);
        console.log('Plz Enter Correct Details:');
        res.redirect('/user');
    }
    else {


        let { id, firstname, lastname, email, mobile } = req.body;
        let password = bcrypt.hashSync(req.body.password, 10);
        console.log(password);

        let qry, qry2;

        qry = "select email,mobile from user where email=? or mobile=?";
        con.query(qry, [email, mobile], (err, result) => {
            if (err) throw err;
            else if (result.length > 0) {
                console.log("user already exist");
                req.flash('user2', result.length);
                res.redirect('/user');
            } else {

                qry2 = "insert into user values(?,?,?,?,?,?)";
                con.query(qry2, [id, firstname, lastname, email, password, mobile], (err, result) => {
                    if (err) throw err;
                    else {
                        req.flash('user', req.body.firstname);
                        console.log(result);
                        res.redirect('user');
                    }
                })

            }
        })


    } //else end

})

//////////////////////////////////////////////////////////////////
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})





///////////////////////////////////////////////////////////////


module.exports = router;