const { sens } = require("../config/config.js");
const CryptoJS = require("crypto-js");//암호화를 위한 CryptoJS모듈
const axios = require("axios");


//mysql연동
const mysql = require('mysql');
const dbconfig = require('../../config/database.js');//db router
const connection = mysql.createConnection(dbconfig);

module.exports = {
    sendVerificationSMS: async (req, res) => {
        try {
            console.log(req.body);
            // const { tel } = req.body;
            // var tel = "01046141099";
            var tp = req.params.tp;
            var content_msg;
            console.log("type: "+tp);
            
            // 환경 변수
            const sens_service_id = sens.serviceId;
            const sens_access_key = sens.accessKey;
            const sens_secret_key = sens.secretKey;
            const sens_call_number = sens.callNumber;
            const sens_user_url = sens.userUrl;
            
            if(tp == 1){   
                console.log("inserted");             
                var tel = req.body.cPhone;
                var userID = req.body.userID;
                content_msg= `${sens_user_url}/${userID}`;
                // const user_phone_number = tel.split("-").join(""); // SMS를 수신할 전화번호
            }else{//tp == 2, loc_cam
                var tel = req.body.cPhone;
                var userID = req.body.userID;
                var type = req.body.type;

                //connection disaster 행동 요령 저장 필요함
                connection.query('SELECT * FROM LC_disaster WHERE type_num = ?',[type],function(err,result){
                    // result.guide
                    content_msg = result.guide;
                })
            }

            const user_phone_number = tel; // SMS를 수신할 전화번호
            // const verificationCode = createRandomNumber(6); // 인증 코드 (6자리 숫자)
            const date = Date.now().toString(); // 날짜 string
        
            // // 환경 변수
            // const sens_service_id = sens.serviceId;
            // const sens_access_key = sens.accessKey;
            // const sens_secret_key = sens.secretKey;
            // const sens_call_number = sens.callNumber;
            // const sens_user_url = sens.userUrl;
            
            // url 관련 변수 선언
            const method = "POST";
            const space = " ";
            const newLine = "\n";
            const url = `https://sens.apigw.ntruss.com/sms/v2/services/${sens_service_id}/messages`;
            const url2 = `/sms/v2/services/${sens_service_id}/messages`;
        
            // signature 작성 : crypto-js 모듈을 이용하여 암호화
            const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, sens_secret_key);
            hmac.update(method);
            hmac.update(space);
            hmac.update(url2);
            hmac.update(newLine);
            hmac.update(date);
            hmac.update(newLine);
            hmac.update(sens_access_key);
            const hash = hmac.finalize();
            const signature = hash.toString(CryptoJS.enc.Base64);
        
            //sens 서버로 요청 전송
            const smsRes = await axios({
                method: method,
                url: url,
                headers: {
                "Content-type": "application/json; charset=utf-8",
                "x-ncp-iam-access-key": sens_access_key,
                "x-ncp-apigw-timestamp": date,
                "x-ncp-apigw-signature-v2": signature,
                },
                data: {
                type: "SMS",
                countryCode: "82",
                from: sens_call_number,
                // content: `인증번호는 [${verificationCode}] 입니다.`,
                content: `${content_msg}`,
                messages: [{ to: `${user_phone_number}`}],
                },
            });    
            // const smsRes = await axios({
            //     method: method,
            //     url: url,
            //     headers: {
            //     "Content-type": "application/json; charset=utf-8",
            //     "x-ncp-iam-access-key": sens_access_key,
            //     "x-ncp-apigw-timestamp": date,
            //     "x-ncp-apigw-signature-v2": signature,
            //     },
            //     data: {
            //     type: "SMS",
            //     countryCode: "82",
            //     from: sens_call_number,
            //     // content: `인증번호는 [${verificationCode}] 입니다.`,
            //     content: `${sens_user_url}/${userID}`,
            //     messages: [{ to: `${user_phone_number}`}],
            //     },
            // });
            
            console.log("response", smsRes.data);
            return res.send(`<script>
                                alert('${user_phone_number} 메세지 전송 성공');
                                location.href='/call_user';
                                //status 2로 변환 필요
                            </script>`
                            );
        }
        catch (err) {
            console.log(err.response);
            // retur`awqn res.status(404).json({ message: "SMS not sent" });
            return res.send(`<script>
                                alert('메세지 전송 실패');
                                location.href='/call_user';
                            </script>`
                            );
        }
    },
};