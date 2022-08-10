//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

// import {login_user} from "./login_out.js";



//body-parser이용
// router.post('/call',function(req,res){
//   var user = req.body.user;
//   console.log(user);
//   res.send(user);
// })

router.post('/auth', (req, res) => {
    res.render('auth');
})

router.post('/company/com', (req, res) => {
    res.render('company');
})

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
        // console.log(result);
        res.render('call',{call:result});        
    });
});

router.get('/auth', (req, res) => {
    const sql = "SELECT * FROM g_auth";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        res.render('auth',{auth:result});        
    });
})

router.get('/company/com', (req, res) => {
    const sql = "SELECT * FROM g_company";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        res.render('company',{company:result});        
    });

    // res.render('company');
})

router.get('/company/user', (req, res) => {
    const sql = "SELECT * FROM g_user";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        res.render('user',{user:result});        
    });
})

router.get('/company/cons', (req, res) => {
    const sql = "SELECT * FROM g_consultant";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        res.render('consultant',{consultant:result});        
    });
})

module.exports = router;


