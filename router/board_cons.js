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
    user.FLAG = req.session.users.flag;

    connection.query('SELECT * FROM g_consultant WHERE conID = ?',[user.ID], function(error, result_user){
        if(error) throw error;
        user.AUTH = result_user[0].authCD;
        user.NAME = result_user[0].cpNM;

        let sql;
        if (user.FLAG===0){
            filter_com_name = 'ALL';
            if (user.AUTH==1){ 
                //superadmin : 전체 노출
                //crud 기능 다 됨 
                sql = "SELECT * FROM g_consultant";
                connection.query(sql,(err, result,field)=>{
                    cons_d = result
                    //filtering을 위한 회사 정보 받아오기, cons_com_d
                    const sql_com = 'SELECT * FROM g_company';
                    connection.query(sql_com, function(error, result){
                        if(error) throw error;
                        cons_com_d = result;
                        res.render('consultant',{
                            accessor : user, 
                            consultant:cons_d,
                            status: "hide", // create, edit, delete 순 
                            create_btn: 'show',
                            cons_com_d : cons_com_d,
                            filter_status:"show",//필터기능 노출 여부
                            filter_com_name : filter_com_name,
                        });   
                    })  
                });
            }
        }else if(user.FLAG===1){
            user.FLAG = 0;
            if (user.AUTH==1){ 
                //superadmin : 전체 노출
                //crud 기능 다 됨 
                sql = "SELECT * FROM g_consultant";
                connection.query(sql,(err, result,field)=>{
                    cons_d = result
                    //filtering을 위한 회사 정보 받아오기, cons_com_d
                    const sql_com = 'SELECT * FROM g_company';
                    connection.query(sql_com, function(error, result){
                        if(error) throw error;
                        cons_com_d = result;
                        res.render('consultant',{
                            accessor : user, 
                            consultant:cons_d,
                            status: "hide", // create, edit, delete 순 
                            create_btn: 'show',
                            cons_com_d : cons_com_d,
                            filter_status:"show",//필터기능 노출 여부
                            filter_com_name : filter_com_name,
                        });   
                    })     
                });
            }
        }
        // 권한 부여 
        if(user.AUTH==2){ 
            //companyadmin : 해당 회사만 노출
            //crud 기능 다 됨 
            sql = "SELECT * FROM g_consultant WHERE cpID = ?";
            connection.query(sql,user.CP,(err, result,field)=>{
                cons_d = result
                res.render('consultant',{
                    accessor : user, 
                    consultant:cons_d,
                    status: "hide",
                    create_btn: 'show',
                    filter_status:"hide"
                });     
            });
        }else if (user.AUTH === 3){ 
            //consultant : 자신만 노출
            //create, delete 안됨, edit 됨 
            sql = "SELECT * FROM g_consultant WHERE conID = ? and cpID = ? ";
            connection.query(sql,[user.ID,user.CP],(err, result,field)=>{
                cons_d = result;
                res.render('consultant',{
                    accessor : user, 
                    consultant:cons_d,
                    status: "hide",
                    create_btn : 'hide',
                    filter_status:"hide"
                });     
            });
        }
    })
    
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
            status:"show",
            create_btn : 'show',
            filter_status:"show"
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

//-filter기능
router.post('/consultant/filter',(req,res)=>{
    user.FLAG = 1;// filter기능 사용
    filter_com_name = req.body.cpID;//filter select box안에 정보 저장
    console.log(filter_com_name);
    //super관리자의 경우
    if(user.AUTH === 1 ){
        if(req.body.cpID === "ALL"){//모든 정보를 보여줌
            const sql1 = "SELECT * FROM g_consultant";
            connection.query(sql1, function(err,result,fields){
                cons_d= result;
                    res.render('consultant',{
                        accessor : user, 
                        consultant:cons_d,
                        status: "hide", // create, edit, delete 순 
                        create_btn: 'show',
                        cons_com_d : cons_com_d,
                        filter_status:"show",//필터기능 노출 여부
                        filter_com_name : filter_com_name,
                });   
                
            });
        }
        else{
            const sql = "SELECT * FROM g_consultant WHERE cpID = ? ";
            connection.query(sql, req.body.cpID, function(err,result,fields){
                if(err) throw err;
                // console.log(req.body.conID);
                cons_d = result;//해당 conID 정보만 보이게 함
                res.render('consultant',{
                    consultant:cons_d,
                    accessor : user,
                    // call_data: result,
                    status:"hide",
                    create_btn: 'show',
                    cons_com_d : cons_com_d,
                    filter_status:"show",
                    filter_com_name : filter_com_name,
                });
            });
        }
    }
    
    
});


module.exports = router;