//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

//고객 정보
var user={};

// //로그인
// router.get('/call', (req, res) => {
//     const sql = "SELECT * FROM g_call";
//     connection.query(sql,(err, result,field)=>{
//         if(err) throw err;
//         //console.log(req.session.users);
//         //고객정보 session으로 받아오기
//         user.ID = req.session.users.user_ID;
//         user.PW = req.session.users.user_PW;
//         user.CP = req.session.users.user_CP;
//         connection.query('SELECT * FROM g_consultant WHERE conID = ?',[user.ID], function(error, result){
//             if(error) throw error;
//             user.AUTH = result[0].authCD;
//             user.NAME = result[0].cpNM;
//             // console.log(user)
//         })
//         a =result;
//         res.render('call',{ 
//             accessor : user, 
//             call:result,
//             status: "hi",
//         });             
//     });
// });

//company
let com_d; //accerssor
router.get('/company/com', (req, res) => {
    const sql = "SELECT * FROM g_company";
    connection.query(sql,(err, result,field)=>{
        if(err) throw err;
        // console.log(result);
        com_d =result;

        //console.log(req.session.users);
        //고객정보 session으로 받아오기
        user.ID = req.session.users.user_ID;
        user.PW = req.session.users.user_PW;
        user.CP = req.session.users.user_CP;
        connection.query('SELECT * FROM g_consultant WHERE conID = ?',[user.ID], function(error, result_user){
            if(error) throw error;
            user.AUTH = result_user[0].authCD;
            user.NAME = result_user[0].cpNM;
            console.log(user);
        })
        user =result_user;

        res.render('company',{
            accessor : user, 
            company:result,
            status: "hi",
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
            status:"by"
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

module.exports = router;