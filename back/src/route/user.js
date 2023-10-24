const express = require('express')

const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Confirm } = require('../class/confirm')

router.post('/signup', function (req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'You must enter all details.',
      })
    }

    const user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message:
          'A user with the same name is already exist',
      })
    }

    const newUser = User.create({
      email,
      password,
    })

    const session = Session.create(newUser)

    Confirm.create(newUser.email)

    return res.status(200).json({
      token: session.token,
      user: session.user,
      isLogged: true,
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

router.get('/signup', (req, res) => {
  const users = Session.getList()
  res.json(users)
})

//====================================================

router.post('/signup-confirm', function (req, res) {
  const { code, token } = req.body

  if (!code || !token) {
    return res.status(400).json({
      message: 'You must enter all details.',
    })
  }

  try {
    const session = Session.get(token)

    if (!session) {
      return res.status(400).json({
        message: 'Error. You are not logged in.',
      })
    }

    const email = Confirm.getData(code)

    if (!email) {
      return res.status(400).json({
        message: 'Invalid or expired code.',
      })
    }

    if (email !== session.user.email) {
      return res.status(400).json({
        message: "The code doesn't match your account.",
      })
    }

    session.isLogged = true
    session.user.isConfirm = true

    return res.status(200).json({
      session,
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

router.get('/signup-confirm', (req, res) => {
  const users = Confirm.getList()
  res.json(users)
})

module.exports = router
