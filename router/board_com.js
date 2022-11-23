//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

//고객 정보
var user={};
let com_d; //accerssor

//company
router.get('/company/com', (req, res) => {
    //console.log(req.session.users);
    //고객정보 session으로 받아오기
    user.ID = req.session.users.user_ID;
    user.PW = req.session.users.user_PW;
    user.CP = req.session.users.user_CP;
    connection.query('SELECT * FROM LC_consultant WHERE conID = ?',[user.ID], function(error, result_user){
        if(error) throw error;
        user.AUTH = result_user[0].authCD;
        user.NAME = result_user[0].cpNM;

        //회사정보 authCD로 노출 
        if(user.AUTH === 1){
            //super관리자 전체 노출
            //crud기능 다됨
            const sql_1 = "SELECT * FROM LC_company";
            connection.query(sql_1,(err, result,field)=>{
                if(err) throw err;
                // console.log(result);
                com_d =result;
                res.render('company',{
                    accessor : user, 
                    company:result,
                    status: "hide",
                    create_btn:"show",
                });        
            });
        }
        else if(user.AUTH === 2){
            //관리자 해당 회사 정보만 노출
            //create기능안됨/ edit에서 delete, cpID 정보 교체 안됨
            const sql_2 = "SELECT * FROM LC_company where cpID=?";
            connection.query(sql_2,[user.CP],(err, result,field)=>{
                if(err) throw err;
                // console.log(result);
                com_d =result;
                res.render('company',{
                    accessor : user, 
                    company:result,
                    status: "hide",
                    create_btn:"hide",
                });        
            });
        }else if(user.AUTH === 3){
            //상담원 노출 안됨
            res.send(`
                <script>
                    alert("접근권한이 없습니다! 'CALL'화면으로 돌아갑니다.");
                    location.href="/call"; //다시 /로 돌아옴
                </script>
                `);  
        }
    })

})

//-company 추가
router.post('/company/com',(req,res)=>{

    //열 이름을 RandomString으로 선언
    connection.query('SELECT SUBSTR(MD5(RAND()),1,8) AS RandomString', (err, result, fields)=>{
        console.log(result[0].RandomString)
        req.body.cpID = result[0].RandomString //cpID로 랜덤 문자열 배정 
        const sql = "INSERT INTO LC_company SET ?"
        connection.query(sql,req.body, (err,result,fields)=>{
            if(err) throw err;
            console.log("회사 추가: "+result);
            res.redirect('/company/com');
        })
    })
})

//-edit파일로 이동
router.get('/company/com/:id',(req,res)=>{
    const sql = "SELECT* FROM LC_company WHERE cpID = ?";
    connection.query(sql, [req.params.id], function(err,result,fields){
        if(err) throw err;
        console.log("회사 접속 직원 id 접속 : "+req.params.id);
        if(user.AUTH === 1){
            res.render('company',{
                company:com_d,
                accessor : user,
                com_data: result,
                status:"show_auth_one",//edit erea 구분
                create_btn:"show"
            });
        }
        else if (user.AUTH === 2){
            res.render('company',{
                company:com_d,
                accessor : user,
                com_data: result,
                create_btn:"hide",
                status:"show_auth_two"//edit erea 구분
            });
        }
    });
});

//-company 수정
router.post('/company/com/update/:id',(req,res)=>{
    const sql = "UPDATE LC_company SET ? WHERE cpID = ?";
    connection.query(sql,[req.body, req.params.id],(err,result,fields)=>{
        if(err) throw err;
        res.redirect('/company/com');
    })
})

//-company 삭제
router.get('/company/com/delete/:id',(req,res)=>{
    const sql = "DELETE FROM LC_company WHERE cpID = ?";
    connection.query(sql,[req.params.id],(err,result,fields)=>{
        if(err) throw err;
        console.log("회사 접속 직원 id 삭제 : "+req.params.id);
        res.redirect('/company/com');
    })
})

module.exports = router;