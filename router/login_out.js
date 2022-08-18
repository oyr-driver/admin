//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

// const flag = '0';
// module.exports = flag;
const pv = 'primitive value';
module.exports = pv;

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
                    user_CP: cpID,
                    flag: 0, 
                };
                //flag 기능 
                //filter기능 이용 후 call정보 update(submit)시 filter 후의 정보가 뜨는 것이 아니라 전체 정보가 
                //다 보임. 이를 flag를 이용하여 get에 접근했는지 안했는지로 정함 
                // 0 접근 안함, 1 접근함

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
