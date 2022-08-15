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
            status: "hi",
        });             
    });
});

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
            status: "hi",
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
            status:"by"
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