// Model: Schema를 감싸주는 역할
// Schema: 여러 가지 정보들을 정의하는 것
const mongoose = require('mongoose'); // mongoose 모듈을 가지고 온다.

// https://www.npmjs.com/package/bcrypt
const bcrypt = require('bcrypt'); // 암호화 라이브러리
// salt를 이용해서 암호화
// salt를 먼저 생성
const saltRounds = 10; // salt의 길이 지정
const jwt = require('jsonwebtoken'); // 비밀번호 토큰 생성

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
        // 0: 일반유저, 1: 관리자, 2: 특정 부서 관리자
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
    } else{
        next(); // 이 부분이 없으면 계속 위 코드에서 머물게 됨(비밀번호 수정이 아닌 경우)
    }
    
});

// 입력한 비밀번호가 맞는지 DB에서 확인
userSchema.methods.comparePassword = function(plainPassword, cb){
    var user = this;
    // Ex) plainPassword: 1234567   암호화된 비밀번호: $2b$10$LWnX73r/q3H0lXf6.98NCeW6XpTV6uTtsY.cdhZc6psxEMMwpSWVm
    // DB에 있는 암호를 복호화해서 비교할 수 없음
    // → 입력한 비밀번호를 암호화한 다음, DB에 있는 비밀번호와 비교한다.
    bcrypt.compare(plainPassword, user.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch); // error를 주지 않고 null로 전달(성공시)
    });
}

// 비밀번호 토큰 생성
userSchema.methods.generateToken = function(cb){
    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken'); // DB에 저장된 _id 프로퍼티와 'secretToken을 이용
    // token을 해석할 때, user._id와 'secretToken'을 합쳐서 유저를 알 수 있게끔 한다.
    // user._id + 'secretToken' = token
    // -> 
    // 'secretToken' -> user._id
    
    user.token = token;
    user.save().then((user) => {
        cb(null, user);
    }).catch((err) => {
        if(err) return cb(err);
    });
};

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // user._id + '' = token;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 token과 DB에 저장된 토큰이 일치하는지 확인
        user.findOne({"_id" : decoded, "token": token})
        .then(user => {
            cb(null, user);
        })
        .catch((err => {
            return cb(err);
        }));
    });
};

const User = mongoose.model('User', userSchema); // mongoose.model(모델이름, 정의한 스키마);

module.exports = { User }; // 다른 파일에서도 사용할 수 있도록 설정