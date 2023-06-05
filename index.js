import id from './secure';
import pwd from './secure';
import clusterName from './secure';
import url from './secure';

const express = require('express'); // 아까 다운로드 받은 express 모듈을 가지고 온다.
const app = express(); // function을 이용해서 새로운 application을 만든다.
const port = 5000;

// Mongoose를 이용해서 Application과 MongoDB 연결
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${id}:${pwd}@${clusterName}.${url}`, {
  // MongoDB 6.0부터는 아래 내용이 기본적으로 지원됨
  // useNewUrlParser: true,
  // useUniFiedTopology: true, 
  // useCreateIndex: true,
  // useFindAndModify: false
}).then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World! ~~ 안녕하세요 ~~')
}); // root directory에 Hello World를 출력하게 설정

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}); // 아까 지정한 port로 해당 application을 실행