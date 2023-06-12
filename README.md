# Node.js & React Basic Study

|날짜|내용|명령어|비고|
|:---:|:---|:---|:---|
|23.06.05|- Node.js 설치 및 버전 확인 <br>- npm명령어를 이용해서 실제 패키지 생성(초기화) 및 다운로드 <br>- 기본적인 템플릿 익히기(package.json 및 package-lock.json)|```$node -v``` <br>```$npm init``` <br>```$npm install mongoose --save``` <br>```$npm run start```| |
|23.06.07|- require 사용해서 중요 정보를 다른 파일에 구현 후 가지고 오기|```exports.id = id;```|
|23.06.08|- body-parser 설치 <br>- postman 설치해서 회원가입을 postman 툴로 진행|```$npm install body-parser --save```|※ 8000 AtlasError 해결(유저 권한에서 read and write 추가)|
|23.06.12|- Nodemon 다운로드 <br>중요 정보 관리방법 <br>bcrypt이용해서 중요 정보 암호화하기|```$npm install nodemon --save-dev``` <br> ```$npm install bcrypt --save``` <br>|Nodemon으로 코드 수정되면 자동으로 서버가 reload되도록 설정 <br>config폴더 생성하여 중요 정보만을 기록하는 js파일을 만들어서 관리 <br>(dev, prod로 나눠서 관리) <br>user의 정보를 저장하기 전, 암호화 처리(salt, hash 이용)|