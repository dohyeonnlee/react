
const express = require('express')
const app = express()
const port = 3000
const config = require('./config/key');
const { User } = require("./models/User")
// const bodyParser = require('body-parser')

//application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: true}))
// //application/json
// app.use(bodyParser.json())

// bodyparser안쓰는경우 --express로 가능
app.use(express.json()) //For JSON requests
app.use(express.urlencoded({extended: true}));

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
.then(() => console.log('mongoDB Connected...'))
.catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res) => {
  //회원가입시 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다

  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true //회원가입 성공시, db저장o
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})