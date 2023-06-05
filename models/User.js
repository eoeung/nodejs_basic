// Model: Schema를 감싸주는 역할
// Schema: 여러 가지 정보들을 정의하는 것

const mongoose = require('mongoose'); // mongoose 모듈을 가지고 온다.

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true, // 공백을 없애주는 역할
        unique: 1, // 오로지 같은 것은 1개만 받음
    }, password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type:String,
        maxlength: 50,
    },
    role: { // 유저별로 권한을 부여할 수 있게 설정
        type: Number,
        default: 0,
    },
    image: String,
    token: { // 토큰으로 유효성 검사 등의 기능을 설정할 수 있음
        type: String,
    },
    tokenExp: { // 토큰의 유효기간
        type: Number,
    }
});

const User = mongoose.model('User', userSchema); // mongoose.model(모델이름, 정의한 스키마);

module.exports = { User }; // 다른 파일에서도 사용할 수 있도록 설정