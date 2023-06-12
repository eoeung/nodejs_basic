const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/key');

const { User } = require('./models/User');
const bodyParser = require('body-parser');

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

    //mongoDB 메서드, user모델에 저장
    const result = user.save().then(()=>{
      res.status(200).json({
        success: true
      })
    }).catch((err)=>{
      res.json({ success: false, err })
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});