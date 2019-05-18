const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const app = express()
const mongoose = require('mongoose')
const Url = require('./models/url')

// 判別開發環境
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config() // 使用 dotenv 讀取 .env 檔案
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/urls', {
  useNewUrlParser: true,
  useCreateIndex: true
})
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))

app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

// routes
app.get('/', (req, res) => {
  res.render('index')
})

// 轉化 Url
app.post('/', (req, res) => {
  res.send('寫入 urls')
})

app.get('/urls', (req, res) => {
  res.render('new')
})

app.listen(process.env.PORT || 3000, () => {
  console.log('App is running: localhost:3000')
})
