
const express = require('express')
const app = express()
const port = 5000
const config = require('./config/key');
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
//const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: true}))
// //application/json
// app.use(bodyParser.json())

// bodyparser안쓰는경우 --express로 가능
app.use(express.json()) //For JSON requests
app.use(express.urlencoded({extended: true}));

app.use(cookieParser())

const mongoose = require('mongoose');
//const read = require('body-parser/lib/read');
const { resetWatchers } = require('nodemon/lib/monitor/watch');
mongoose.connect(config.mongoURI)
.then(() => console.log('mongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/hello', (req,res) => {
  //받은다음에
  
  res.send('안녕하세여 ~')
})

app.post('/api/users/register', (req, res) => {
  //회원가입시 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다

  const user = new User(req.body)

  //save하기전 암호화

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true //회원가입 성공시, db저장o
    })
  })
})

app.post('/api/users/login', (req, res) => {
  // 1. 요청된 이메일을 데이터베이스에서 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    
// 2. 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인

    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
      return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
  
    
        // 3. 비밀번호까지 맞다면 user를 위한 token생성
        user.generateToken((err, user) => {
          if(err) return res.status(400).send(err);


          //토큰을 저장, 어디에? 쿠키, 로컬스토리지, 
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id})
        })
    })
    
  })
  

})

//role 1 admin , role 2 특정부서 admin
//role 0 -> 일반유저 , 0아니면 관리자

app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 middleware 통과해왔다는 것 -> authentication이 true
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true, 
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id},
    {token: ""},
    (err, user) => {
      if(err) return res.json({success:false, err});
      return res.status(200).send({
        success: true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})