// 학습한 것을 주석으로 저장하여 사용하는 js파일
// 실제로 적용하는 것 보다 각각의 코드나 소스가 의미하는 바를 주석처리 하여 저장한 것으로, 공부하기 위한 것임

const express = require('express'); // 아까 다운로드 받은 express 모듈을 가지고 온다.
// $ npm install mongoose --save
const mongoose = require('mongoose'); // Mongoose를 이용해서 Application과 MongoDB 연결
// const secure = require('./secure'); // 중요 정보 저장 // 이제는 secure를 사용하지 않고 config폴더에 있는 dev.js, prod.js, key.js로 구분
const config = require('./config/key'); // config폴더에 있는 key.js 정보를 가지고 온다.

const { User } = require('./models/User'); // 미리 만들었던 User Schema를 가지고온다.
// $ npm install body-parser --save
const bodyParser = require('body-parser'); // body-parser 모듈을 가지고 온다.
// body-parser는 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 해주는 모듈

const app = express(); // function을 이용해서 새로운 application을 만든다.
const port = 5000; // 포트
app.use(bodyParser.urlencoded({extended: true})); // application/x-www-form-urlencoded <<이런 모양으로 된 데이터를 분석해서 가져올 수 있게 해주는 역할
app.use(bodyParser.json()); // 마찬가지로 application/json을 분석해서 가져올 수 있게 해준다.

// mongoose.connect(`mongodb+srv://${secure.id}:${secure.pwd}@${secure.clusterName}.${secure.url}`, {
mongoose.connect(config.mongoURI, {
  // MongoDB 6.0부터는 아래 내용이 기본적으로 지원됨
  // useNewUrlParser: true,
  // useUniFiedTopology: true, 
  // useCreateIndex: true,
  // useFindAndModify: false
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err));

// 간단한 route
app.get('/', (req, res) => {
    res.send('Hello World! ~~ 안녕하세요 ~~')
}); // root directory에 Hello World를 출력하게 설정

// postman 다운로드 (https://www.postman.com/downloads/?utm_source=postman-home)
// 회원가입을 위한 route 생성 (Register Route)
// route의 end-point는 '/register'
app.post('/register', (req, res) => {
    // 회원가입 할 때 필요한 정보들을 client에서 가져오면
    // 가져온 정보들을 DB에 저장

    // request.body에 대략 이러한 내용이 들어가 있음
    // {
    //   id: "hello",
    //   password: "123"
    // }

    // save하기 전에 비밀번호를 암호화해야한다. → User.js 참고
    // bcrypt이용

    // body-parser가 있기 때문에 클라이언트의 정보를 request body로 받아올 수 있음
    const user = new User(req.body);

    //mongoDB 메서드, user모델에 저장
    const result = user.save().then(()=>{
    res.status(200).json({
      success: true
        })
    }).catch((err)=>{
        res.json({ success: false, err })
    });

    // 넘어온 정보를 user에 저장한다.
    // MongooseError: Model.prototype.save() no longer accepts a callback
    // https://www.inflearn.com/questions/805491/%EA%B0%95%EC%9D%98%EC%97%90-%EB%82%98%EC%98%A4%EB%8A%94-%EB%AC%B8%EB%B2%95%EC%9D%B4-%EC%A0%81%EC%9A%A9%EB%90%98%EC%A7%80-%EC%95%8A%EC%8A%B5%EB%8B%88%EB%8B%A4
    // user.save((err, userInfo) => {
    //     if(err) return res.json({ success: false, err});
    //     return res.status(200).json({ success: true});
    // });
});

// 로그인
app.post('/login', (req, res) => {
  // 1. 요청된 이메일을 DB에 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => { // request.body에서 입력된 email을 가지고 온다. → 일치하면 user객체를 전달
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }
    // 2. 요청된 이메일이 DB에 있다면, 비밀번호가 일치하는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => { // User.js에 비밀번호가 일치하는지 확인하는 comparePassword()함수를 작성
      if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." });

      // 3. 비밀번호까지 맞다면 토큰 생성하기
      user.generateToken((err, user) => {
        
      });
    });
  
  });

  

  


});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}); // 아까 지정한 port로 해당 application을 실행