//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

//고객 정보
var user={};
let cons_d;//accessor

//consultant
router.get('/company/cons', (req, res) => {
    user.ID = req.session.users.user_ID;
    user.PW = req.session.users.user_PW;
    user.CP = req.session.users.user_CP;

    connection.query('SELECT * FROM g_consultant WHERE conID = ?',[user.ID], function(error, result_user){
        if(error) throw error;
        user.AUTH = result_user[0].authCD;
        user.NAME = result_user[0].cpNM;
    })
    let sql;
    // 권한 부여 
    if (user.AUTH==1){ //superadmin
        sql = "SELECT * FROM g_consultant";
        connection.query(sql,(err, result,field)=>{
            cons_d = result
            res.render('consultant',{
                accessor : user, 
                consultant:cons_d,
                status: "hide",
                buttonStatus : ['block','block','block'] // create, edit, delete 순 
            });     
        });
    }else if(user.AUTH==2){ //companyadmin
        sql = "SELECT * FROM g_consultant WHERE cpID = ?";
        connection.query(sql,user.CP,(err, result,field)=>{
            cons_d = result
            res.render('consultant',{
                accessor : user, 
                consultant:cons_d,
                status: "hide",
                buttonStatus : ['block','block','block']
            });     
        });
    }else{ //consultant
        sql = "SELECT * FROM g_consultant WHERE conID = ?";
        connection.query(sql,user.ID,(err, result,field)=>{
            cons_d = result
            res.render('consultant',{
                accessor : user, 
                consultant:cons_d,
                status: "hide",
                buttonStatus : ['none','block','none']
            });     
        });
    }
});

//-consultant 추가
router.post('/company/cons',(req,res)=>{
    const sql = "INSERT INTO g_consultant SET ?"
    connection.query(sql,req.body, (err,result,fields)=>{
        if(err) throw err;
        console.log("consultant 추가: "+result);
        res.redirect('/company/cons');
    })
})

//-consultant 불러오기??
router.get('/company/cons/:id',(req,res)=>{
    const sql = "SELECT* FROM g_consultant WHERE conID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log("상담원 id 접속 : "+req.params.id);
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
        console.log("상담원 삭제 : "+req.params.id);
        res.redirect('/company/cons');
    })
})



module.exports = router;