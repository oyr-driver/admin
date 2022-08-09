//라우터 쪼개기
const express = require('express');
const router =  express.Router();

//body-parser이용
// router.post('/call',function(req,res){
//   var user = req.body.user;
//   console.log(user);
//   res.send(user);
// })

//post
// router.post('/call', (req, res) => {
//     res.render('call');
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

router.post('/company/user', (req, res) => {
    res.render('user');
})

//get
router.get('/call', (req, res) => {
    res.render('call');
});

router.get('/auth', (req, res) => {
    res.render('auth');
})

router.get('/company/com', (req, res) => {
    res.render('company');
})

router.get('/company/user', (req, res) => {
    res.render('user');
})

router.get('/company/cons', (req, res) => {
    res.render('consultant');
})

module.exports = router;


