//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

//고객 정보
var user={};
let call_d;

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
        call_d =result;
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
    const sql = "INSERT INTO g_call SET ?"
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
            call:call_d,
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

module.exports = router;