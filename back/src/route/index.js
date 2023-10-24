// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
const { User } = require('../class/user')

// Підключіть файли роутів
const userRouter = require('./user')
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
router.use('/', userRouter)
// Використовуйте інші файли роутів, якщо є

router.get('/', (req, res) => {
  const users = User.getList()
  res.json(users)
})

// Експортуємо глобальний роутер
module.exports = router
