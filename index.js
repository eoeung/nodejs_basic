const express = require('express'); // 아까 다운로드 받은 express 모듈을 가지고 온다.
const app = express(); // function을 이용해서 새로운 application을 만든다.
const port = 5000;

app.get('/', (req, res) => {
  res.send('Hello World! ~~ 안녕하세요 ~~')
}); // root directory에 Hello World를 출력하게 설정

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}); // 아까 지정한 port로 해당 application을 실행