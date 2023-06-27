const { User } = require('../models/User');

let auth = (req, res, next) => {
    // 인증처리들을 여기서 진행
    // 1. 클라이언트 쿠키에서 token을 가지고온다.
    let token = req.cookies.x_auth; // 토큰을 쿠키에서 가지고온다.

    // 2. token을 복호화한 후, 유저를 찾는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true});

        // token과 user를 request에 넣어줌으로써 사용할 수 있도록 해준다.
        req.token = token;
        req.user = user;
        next(); // middleware에서 계속 진행할 수 있도록 해주는 코드
    });

    // 3. 유저가 있으면 인증 성공


    // 4. 유저가 없으면 인증 실패


};

module.exports = { auth };