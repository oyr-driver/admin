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
    const user = req.body.user;
    const pw = req.body.password;
    const cpID = req.body.cpID;

    if(user && pw && cpID){
        connection.query('SELECT * FROM user WHERE cpID=? and cpPW=? and cpNM=?',[user,pw,cpID],function(error, result){
            if(error) throw error;
            if(result.length>0){//로그인 성공
                //session 정보 저장
                req.session.users = {
                    user_ID: user,
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
    res.sendFile(__dirname + "/views/create_user/add.html");
})

router.get('/logout',(req,res)=>{
    console.log('로그아웃 성공');
      // req.session.destroy(function(err){
      //     res.redirect('/');
      // });
    res.redirect('/login');
});

module.exports = router;