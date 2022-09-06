//dotenv는 환경변수를 .env라는 파일에 저장하고
//process.env로 로드하는 의존성 모듈
const dotenv = require("dotenv");
dotenv.config();

function required(key, defaultValue = undefined) {
    const value = process.env[key] || defaultValue;
    // console.log("출력 "+ process.env);
    if (value == null) {
        throw new Error(`Key ${key} is undefined`);
    }
    return value;
}

module.exports = {
    sens: {
        accessKey: required("NCP_SENS_ACCESS"),
        secretKey: required("NCP_SENS_SECRET"),
        serviceId: required("NCP_SENS_ID"),
        callNumber: required("NCP_SENS_NUMBER"),
        userUrl: required("USER_URL"),
    },
};

