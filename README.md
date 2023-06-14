# Node.js & React Basic Study

<br>

||날짜|내용|명령어|비고|
|:---:|:---:|:---|:---|:---|
|1|23.06.05|- Node.js 설치 및 버전 확인 <br>- npm명령어를 이용해서 실제 패키지 생성(초기화) 및 다운로드 <br>- 기본적인 템플릿 익히기(package.json 및 package-lock.json)|```$node -v``` <br>```$npm init``` <br><br>```$npm install mongoose --save``` <br><br>```$npm run start```| |
|2|23.06.07|- require 사용해서 중요 정보를 다른 파일에 구현 후 가지고 오기|```exports.id = id;```|
|3|23.06.08|- body-parser 설치 <br>- postman 설치해서 회원가입을 postman 툴로 진행|```$npm install body-parser --save```|※ 8000 AtlasError 해결(유저 권한에서 read and write 추가)|
|4|23.06.12|- Nodemon 다운로드 <br>- 중요 정보 관리방법 <br>- bcrypt이용해서 중요 정보 암호화하기|```$npm install nodemon --save-dev``` <br><br> ```$npm install bcrypt --save``` <br> ```bcrypt.genSalt(saltRounds)```<br> ```bcrypt.hash(user.password, salt)```|※ Nodemon으로 코드 수정되면 자동으로 서버가 reload되도록 설정 <br>※ config폴더 생성하여 중요 정보만을 기록하는 js파일을 만들어서 관리 <br>(dev, prod로 나눠서 관리) <br>※ user의 정보를 저장하기 전, 암호화 처리(salt, hash 이용)|
|5|23.06.14|- 로그인 기능 구현-1 |```User.findOne({ email: req.body.email}, (err, user) => {...})```<br><br>```user.comparePassword(req.body.password, (err, isMatch) => {...})``` <br>```bcrypt.compare(plainPassword, this.password)```|※ 입력받은 값이 DB에 있는 정보와 일치하는지 확인<br> (1. 이메일 확인 / 2. 비밀번호 확인)|
|6|23.06.14|- 로그인 기능 구현-2 |```user.generateToken((err, user) => {...})```<br><br>```var token = jwt.sign(user._id.toHexString(), 'secretToken');```|※입력받은 값이 DB에 있는 정보와 일치하는지 확인<br>(3. 비밀번호가 일치하면 토큰을 생성)<br>※ 토큰을 만들어서 쿠키에 저장|