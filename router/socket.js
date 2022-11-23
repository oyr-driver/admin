const WebSocket = require('ws');
//mysql연동
const mysql = require('mysql');
const dbconfig = require('../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

module.exports = (socketPort) =>{  
    const socket = new WebSocket.Server({port: socketPort});

    socket.on('connection', (ws, req)=>{
        ws.interval = setInterval(()=>{
            if(ws.readyState!=ws.OPEN){ 
                return;
            }
            // console.log("loc: "+global.socketflag);
            // console.log("cam: "+global.socketflag_cam);
        
            if(socketflag == 1){
                ws.send(socketflag); //socketflag 클라이언트에 전송 (0:insert X, 1:insert O)
                if (socketflag==1){ 
                    socketflag=0 //다시 되돌림
                    global.socketflag=socketflag;
                }
            }
            if(socketflag_cam == 1){
                ws.send(socketflag_cam); //socketflag 클라이언트에 전송 (0:insert X, 1:insert O)
                if(socketflag_cam == 1){
                    socketflag_cam=0 //다시 되돌림
                    global.socketflag_cam=socketflag_cam;
                }
            }
        },3000); //3초마다 실행 

        
    })
    
    // socket.on('connection', (ws, req)=>{
    //     ws.on('message',(msg)=>{
    //         console.log('유저가 보낸 거 : '+ msg);
    //     })
    //     ws.interval = setInterval(()=>{
    //         if(ws.readyState!=ws.OPEN){
    //         return;
    //         }
    //         ws.send("서버에서 클라이언트로 메시지를 보냅니다.");
    //     },3000);
    // })
    
}