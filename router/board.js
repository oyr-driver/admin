//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

//고객 정보
var user={};

//body-parser이용
// router.post('/call',function(req,res){
//   var user = req.body.user;
//   console.log(user);
//   res.send(user);
// })

router.post('/auth', (req, res) => {
    res.render('auth');
})

// router.post('/company/com', (req, res) => {
//     res.render('company');
// })

router.post('/company/cons', (req, res) => {
    res.render('consultant');
})

//상담원 삭제 기능 구현
router.get('/company/cons/delete/:id',(req,res)=>{
    const sql = "DELETE FROM g_consultant WHERE conID = ?";
    connection.query(sql,[req.params.conID],(err, result, field)=>{
        if(err) throw err;
        console.log(result);
        res.redirect('/company/cons');
    })
})

router.post('/company/user', (req, res) => {
    res.render('user');
})

//get
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
            status: "hi",
        });             
    });
});

router.get('/call/:id',(req,res)=>{
    const sql = "SELECT* FROM g_call WHERE callID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log(req.params.id);
        res.render('call',{
            call:a,
            accessor : user,
            call_data: result,
            status:"by"
        });
    });
});
router.get('/auth', (req, res) => {
    const sql = "SELECT * FROM g_auth";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        res.render('auth',{accessor : user, auth:result});        
    });
})

let a;
router.get('/company/com', (req, res) => {
    const sql = "SELECT * FROM g_company";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        a =result;
        res.render('company',{
            accessor : user, 
            company:result,
            status: "hi",
        });        
    });
})

//company 추가
router.post('/company/com',(req,res)=>{
    const sql = "INSERT INTO g_company SET ?"
    connection.query(sql,req.body, (err,result,fields)=>{
        if(err) throw err;
        console.log(result);
        res.redirect('/company/com');
    })
})

router.get('/company/com/:id',(req,res)=>{
    const sql = "SELECT* FROM g_company WHERE cpID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log(req.params.id);
        res.render('company',{
            company:a,
            accessor : user,
            com_data: result,
            status:"by"
        });
    });
});


router.get('/company/user', (req, res) => {
    const sql = "SELECT * FROM g_user";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        a =result;
        res.render('user',{
            accessor : user, 
            user:result,
            status: "hi",
        });            
    });
})

router.get('/company/user/:id',(req,res)=>{
    const sql = "SELECT* FROM g_user WHERE userID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log(req.params.id);
        res.render('user',{
            user:a,
            accessor : user,
            user_data: result,
            status:"by"
        });
    });
});

router.get('/company/cons', (req, res) => {
    const sql = "SELECT * FROM g_consultant";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        a =result;
        res.render('consultant',{
            accessor : user, 
            consultant:result,
            status: "hi",
        });       
    });
})

router.get('/company/cons/:id',(req,res)=>{
    const sql = "SELECT* FROM g_consultant WHERE conID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log(req.params.id);
        res.render('consultant',{
            consultant:a,
            accessor : user,
            cons_data: result,
            status:"by"
        });
    });
});
module.exports = router;