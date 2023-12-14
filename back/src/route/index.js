// Підключаємо роутер до бек-енду
const express = require('express')
const router = express.Router()
const { Session } = require('../class/session')

// Підключіть файли роутів
const userRouter = require('./user')
// Підключіть інші файли роутів, якщо є

// Об'єднайте файли роутів за потреби
router.use('/', userRouter)
// Використовуйте інші файли роутів, якщо є

// ==============================================

router.get('/', (req, res) => {
  const { token } = req.query

  if (!token) {
    return res.status(400).json({
      message: 'Token is required in the query parameters.',
    })
  }

  const user = Session.getForUser(token)

  if (user) {
    return res.json(user)
  } else {
    return res.status(404).json({
      message: 'User not found.',
    })
  }
})

// Експортуємо глобальний роутер
module.exports = router
