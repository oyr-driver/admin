//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

router.get('/login', (req, res) => {
    res.render('login');
});

//로그인
router.post('/call', (req, res) => {
    const conID = req.body.conID;
    const pw = req.body.password;
    const cpID = req.body.cpID;

    if(conID && pw && cpID){
        connection.query('SELECT * FROM g_consultant WHERE conID=? and conPW=? and cpID=?',[conID,pw,cpID],function(error, result){
            if(error) throw error;
            if(result.length>0){//로그인 성공
                //session 정보 저장
                req.session.users = {
                    user_ID: conID,
                    user_PW:pw,
                    user_CP: cpID 
                };

                console.log('로그인 성공');
                console.log("id: "+req.session.users.user_ID + ", pw: "+ req.session.users.user_PW + ", cp: "+req.session.users.user_CP);
                res.redirect('call');
            }
            else{//로그인 실패
                res.send(`
                <script>
                    alert("로그인 실패!");
                    location.href="/login"; //다시 /로 돌아옴
                </script>
                `);  
            }
        
        })
    }
})

  //회원가입 페이지로 이동
router.get('/create',function(req,res){
    res.render('add');
})

router.post('/create',(req,res)=>{
    const sql = "INSERT INTO g_consultant SET ?"

    connection.query(sql,req.body,(err,result,field)=>{
        if(err) throw err;
        console.log(result);
        res.send(`
            <script>
                alert("회원가입 성공");
                location.href="/login";
            </script>
        `);
    })
})

router.get('/logout',(req,res)=>{
    console.log('로그아웃 성공');
        req.session.destroy(function(err){
        res.redirect('/login');
    });
});

module.exports = router;