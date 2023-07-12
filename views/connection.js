const mysql=require('mysql2');
const con=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    port:process.env.DB_PORT
})
con.connect((err,result)=>{
if (err) throw err;
else{
    console.log(`database connection done!`);
}
})

let qry; 
qry="select * from employee";
con.query(qry,(err,result)=>{
    if (err) throw err;
    else{
        //console.log(result);
    }
})


module.exports=con;