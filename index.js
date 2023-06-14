const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/key');

const { User } = require('./models/User');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const port = 5000;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect(config.mongoURI, {
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World! ~~ 안녕하세요 ~~')
});

// 회원가입을 위한 route 생성 (Register Route)
app.post('/register', (req, res) => {
    // 회원가입 할 때 필요한 정보들을 client에서 가져오면
    // 가져온 정보들을 DB에 저장

    // body-parser가 있기 때문에 클라이언트의 정보를 request body로 받아올 수 있음
    const user = new User(req.body);

    // save하기 전에 비밀번호를 암호화해야한다. → User.js 참고
    // bcrypt이용

    //mongoDB 메서드, user모델에 저장
    const result = user.save().then(()=>{
      res.status(200).json({ success: true });
    }).catch((err)=>{
      res.json({ success: false, err });
    });
});

// 로그인
app.post('/login', (req, res) => {
  // 1. 요청된 이메일을 DB에 있는지 찾는다.
  User.findOne({ email: req.body.email })
  .then(user => {
    if(!user){
      return res.json({ loginSuccess: false, message: "제공된 이메일에 해당하는 유저가 없습니다." });
    }
    // 2. 요청된 이메일이 DB에 있다면, 비밀번호가 일치하는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

      // 3. 비밀번호까지 맞다면 토큰 생성하기
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);
        
        // 토큰을 저장한다.
        // 어디에 ?  쿠키, 로컬스토리지 등
        // 지금은 쿠키에 저장
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id});

      });
    });
  })
  .catch((err) => {
    return res.status(400).send(err);
  });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});