const http = require('http');
const express = require('express');
const ejs = require('ejs');
const boardRouter = require('./router/board.js');//require이용하여 모듈을 가지고 옴, 페이지 라우터
const board_call_Router = require('./router/board_call.js');//require이용하여 모듈을 가지고 옴, call라우터
const board_com_Router = require('./router/board_com.js');//require이용하여 모듈을 가지고 옴, call라우터
const board_cons_Router = require('./router/board_cons.js');//require이용하여 모듈을 가지고 옴, call라우터
const board_log_Router = require('./router/login_out.js');//로그인 라우터
const bodyParser = require('body-parser');//body를 parsing해주는 미들웨어
const expressSession=require('express-session');//session 사용할때 필요

//mysql연동
const mysql = require('mysql');
const dbconfig = require('./config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

const app = express();
const server = http.createServer(app);
const port = 5000;

//view engine setup
app.set('views','./views');
app.set('view engine', 'ejs');

//미들웨어 등록
app.use(express.json());//req.body.user, req.body.pw 사용하기 위함 (body-parser)
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static("assets"));
app.use(express.static("public"));

//세션 세팅, 클라이언트와 서버 사이 세션 사용 위함
app.use(expressSession({
  secret:'my key',
  resave:false, //세션 매번 다시 저장
  saveUninitialized:false //아무 내용 없는 session 저장할 것인지
}));

//라우터 연결
// app.use(boardRouter);
app.use(board_call_Router);
app.use(board_com_Router);
app.use(board_cons_Router);
app.use(board_log_Router);

connection.connect();
// connection.query('SELECT * from user',(err,rows, fields)=>{
//   if(err) throw err;
//   console.log('user info is :',rows);
// })
connection.end();

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

