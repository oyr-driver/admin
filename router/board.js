//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

//고객 정보
var user={};

//로그인
router.get('/call', (req, res) => {
    const sql = "SELECT * FROM g_call";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        //console.log(req.session.users);
        //고객정보 session으로 받아오기
        user.ID = req.session.users.user_ID;
        user.PW = req.session.users.user_PW;
        user.CP = req.session.users.user_CP;
        connection.query('SELECT * FROM g_consultant WHERE conID = ?',[user.ID], function(error, result){
            if(error) throw error;
            user.AUTH = result[0].authCD;
            user.NAME = result[0].cpNM;
            // console.log(user)
        })
        a =result;
        res.render('call',{ 
            accessor : user, 
            call:result,
            status: "hide",
        });             
    });
});

//call
//-call 추가
router.post('/call/create',(req,res)=>{
    const sql = "INSERT INTO g_call SET ? "
    connection.query(sql,req.body, (err,result,fields)=>{
        if(err) throw err;
        console.log(result);
        res.redirect('/call');
    })
})

//-edit파일로 이동
router.get('/call/:id',(req,res)=>{
    const sql = "SELECT* FROM g_call WHERE callID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log(req.params.id);
        res.render('call',{
            call:a,
            accessor : user,
            call_data: result,
            status:"show"
        });
    });
});

//-call 수정
router.post('/call/update/:id',(req,res)=>{
    const sql = "UPDATE g_call SET ? WHERE callID = ?";
    connection.query(sql,[req.body, req.params.id],(err,result,fields)=>{
        if(err) throw err;
        res.redirect('/call');
    })
})

//-call 삭제
router.get('/call/delete/:id',(req,res)=>{
    const sql = "DELETE FROM g_call WHERE callID = ?";
    connection.query(sql,[req.params.id],(err,result,fields)=>{
        if(err) throw err;
        res.redirect('/call');
    })
})


//auth 데이터 불러오기
router.get('/auth', (req, res) => {
    const sql = "SELECT * FROM g_auth";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        res.render('auth',{accessor : user, auth:result});        
    });
})

//company
let com_d; //accerssor
router.get('/company/com', (req, res) => {
    const sql = "SELECT * FROM g_company";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        com_d =result;
        res.render('company',{
            accessor : user, 
            company:result,
            status: "hide",
        });        
    });
})

//-company 추가
router.post('/company/com',(req,res)=>{
    const sql = "INSERT INTO g_company SET ?"
    connection.query(sql,req.body, (err,result,fields)=>{
        if(err) throw err;
        console.log(result);
        res.redirect('/company/com');
    })
})

//-edit파일로 이동
router.get('/company/com/:id',(req,res)=>{
    const sql = "SELECT* FROM g_company WHERE cpID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log(req.params.id);
        res.render('company',{
            company:com_d,
            accessor : user,
            com_data: result,
            status:"show"
        });
    });
});

//-company 수정
router.post('/company/com/update/:id',(req,res)=>{
    const sql = "UPDATE g_company SET ? WHERE cpID = ?";
    connection.query(sql,[req.body, req.params.id],(err,result,fields)=>{
        if(err) throw err;
        res.redirect('/company/com');
    })
})

//-company 삭제
router.get('/company/com/delete/:id',(req,res)=>{
    const sql = "DELETE FROM g_company WHERE cpID = ?";
    connection.query(sql,[req.params.id],(err,result,fields)=>{
        if(err) throw err;
        res.redirect('/company/com');
    })
})

//user
let user_d; //accerssor
router.get('/company/user', (req, res) => {
    const sql = "SELECT * FROM g_user";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        user_d =result;
        res.render('user',{
            accessor : user, 
            user:result,
            status: "hide",
        });            
    });
})

/* user table 삭제 결정_2022.08.15
//-user 추가
router.post('/company/user',(req,res)=>{
    const sql = "INSERT INTO g_user SET ?"
    connection.query(sql,req.body, (err,result,fields)=>{
        if(err) throw err;
        console.log(result);
        res.redirect('/company/user');
    })
})

//-user 불러오기??
router.get('/company/user/:id',(req,res)=>{
    const sql = "SELECT* FROM g_user WHERE userID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log(req.params.id);
        res.render('user',{
            user:user_d,
            accessor : user,
            user_data: result,
            status:"show"
        });
    });
});

//-user 수정
router.post('/company/user/update/:id',(req,res)=>{
    const sql = "UPDATE g_user SET ? WHERE userID = ?";
    connection.query(sql,[req.body, req.params.id],(err,result,fields)=>{
        if(err) throw err;
        res.redirect('/company/user');
    })
})

//-user 삭제
router.get('/company/user/delete/:id',(req,res)=>{
    const sql = "DELETE FROM g_user WHERE userID = ?";
    connection.query(sql,[req.params.id],(err,result,fields)=>{
        if(err) throw err;
        res.redirect('/company/user');
    })
})
*/

//consultant
let cons_d;//accessor
router.get('/company/cons', (req, res) => {
    const sql = "SELECT * FROM g_consultant";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        cons_d =result;
        res.render('consultant',{
            accessor : user, 
            consultant:result,
            status: "hide",
        });       
    });
})

//-company 추가
router.post('/company/cons',(req,res)=>{
    const sql = "INSERT INTO g_consultant SET ?"
    connection.query(sql,req.body, (err,result,fields)=>{
        if(err) throw err;
        console.log(result);
        res.redirect('/company/cons');
    })
})

//-consultant 불러오기??
router.get('/company/cons/:id',(req,res)=>{
    const sql = "SELECT* FROM g_consultant WHERE conID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log(req.params.id);
        res.render('consultant',{
            consultant:cons_d,
            accessor : user,
            cons_data: result,
            status:"show"
        });
    });
});

//-consultant 수정
router.post('/company/cons/update/:id',(req,res)=>{
    const sql = "UPDATE g_consultant SET ? WHERE conID = ?";
    connection.query(sql,[req.body, req.params.id],(err,result,fields)=>{
        if(err) throw err;
        res.redirect('/company/cons');
    })
})

//-consultant 삭제
router.get('/company/cons/delete/:id',(req,res)=>{
    const sql = "DELETE FROM g_consultant WHERE conID = ?";
    connection.query(sql,[req.params.id],(err,result,fields)=>{
        if(err) throw err;
        res.redirect('/company/cons');
    })
})



module.exports = router;