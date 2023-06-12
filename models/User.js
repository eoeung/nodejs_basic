// Model: Schema를 감싸주는 역할
// Schema: 여러 가지 정보들을 정의하는 것
const mongoose = require('mongoose'); // mongoose 모듈을 가지고 온다.

// https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt'); // 암호화 라이브러리
// salt를 이용해서 암호화
// salt를 먼저 생성
const saltRounds = 10; // salt의 길이 지정

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true, // 공백을 없애주는 역할
        unique: 1, // 오로지 같은 것은 1개만 받음
    },
    password: {
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

// User모델에 정보를 저장하기 전에 무엇을 진행한다는 의미
userSchema.pre('save', function(next){
    var user = this; // this는 userSchema 변수를 가리킴

    // 비밀번호를 바꿀 때만 작동해야하기 때문에, 조건을 걸어줌
    // Ex) 이메일 수정할 때도 작동하면 안됨
    if(user.isModified('password')){
        // 비밀번호를 암호화
        // salt를 생성 → saltRounds가 필요함
        bcrypt.genSalt(saltRounds, function(err, salt){ // callback function(err값, salt를 전달)
            if(err) return next(err); // next()를 하게 되면 index.js에 있는 user.save()로 바로 이동

            bcrypt.hash(user.password, salt, function(err, hash){ // hash(암호화 안된 순수 비밀번호, 생성한 salt, callback function(err값, hash(암호화 된 값) 전달))
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    }
    
});

const User = mongoose.model('User', userSchema); // mongoose.model(모델이름, 정의한 스키마);

module.exports = { User }; // 다른 파일에서도 사용할 수 있도록 설정