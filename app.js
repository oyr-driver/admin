const http = require('http');
const express = require('express');
const ejs = require('ejs');

const app = express();
const server = http.createServer(app);

const port = 5000;

app.set('views','./views');
app.set('view engine', 'ejs');

app.use(express.static("assets"));
app.use(express.static("public"));

app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/layout', (req, res) => {
  // res.render('charts-chartjs');
  res.render('forms-layouts');
})

app.post('/call', (req, res) => {
  res.render('call');
})

app.post('/auth', (req, res) => {
  res.render('auth');
})

app.post('/user', (req, res) => {
  res.render('user');
})

app.get('/call', (req, res) => {
  res.render('call');
})

app.get('/auth', (req, res) => {
  res.render('auth');
})

app.get('/user', (req, res) => {
  res.render('user');
})

//회원가입 페이지로 이동
app.get('/create',function(req,res){
  res.sendFile(__dirname + "/views/create_user/add.html");
})

app.get('/logout',(req,res)=>{
    console.log('로그아웃 성공');
    // req.session.destroy(function(err){
    //     res.redirect('/');
    // });
    res.redirect('/login');

})
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

