const express = require('express')

const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Confirm } = require('../class/confirm')
const { Transaction } = require('../class/transaction')

router.post('/signup', function (req, res) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'You must enter all details.',
      })
    }

    let user = User.getByEmail(email)

    if (user) {
      return res.status(400).json({
        message:
          'The user with this email is already exist.',
      })
    } else {
      user = User.create({
        email,
        password,
      })
    }

    const session = Session.create(user)

    Confirm.create(user.email)

    return res.status(200).json(session)
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

// router.get('/signup', (req, res) => {
//   const users = User.getList()
//   res.json(users)
// })

//====================================================

router.post('/signup-confirm', function (req, res) {
  try {
    let { code, token } = req.body

    if (!code) {
      return res.status(400).json({
        message: 'You must enter all details.',
      })
    }

    const email = Confirm.getEmailByCode(code)

    if (!token) {
      token = Session.regenerateToken(email)
    }

    const session = Session.getForUser(token)

    if (!session) {
      return res.status(400).json({
        message: 'Error. You are not logged in.',
      })
    }

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

    session.user.isConfirm = true

    return res.status(200).json(session)
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

//====================================================

router.post('/signin', function (req, res) {
  try {
    let { email, password, token } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: 'You must enter all details.',
      })
    }

    if (!token) {
      token = Session.regenerateToken(email)
    }

    const session = Session.getForUser(token)

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'The user with this email does not exist.',
      })
    }

    if (user.password !== password) {
      return res.status(400).json({
        message: 'Authentication failed.',
      })
    }

    if (session) {
      if (session.user.isConfirm) {
        return res.status(200).json(session)
      } else {
        return res.status(400).json({
          message:
            'The email has not been confirmed. Please confirm your email!',
        })
      }
    } else {
      return res.status(400).json({
        message: 'No existing session for this user.',
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//====================================================

router.post('/recovery', function (req, res) {
  try {
    let { email, token } = req.body

    if (!email) {
      return res.status(400).json({
        message: 'You must enter all details.',
      })
    }

    if (!token) {
      token = Session.regenerateToken(email)
    }

    const user = User.getByEmail(email)

    if (!user) {
      return res.status(400).json({
        message: 'The user with this email does not exist.',
      })
    }

    const session = Session.getForUser(token)

    if (!session) {
      return res.status(400).json({
        message: 'No existing session for this user.',
      })
    }

    if (Confirm.getByEmail(email)) {
      Confirm.regenerateCode(email)
    } else {
      Confirm.create(email)
    }

    if (session.user.isConfirm) {
      return res.status(200).json(session)
    } else {
      return res.status(400).json({
        message:
          'The email has not been confirmed. Please confirm your email!',
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//====================================================

router.post('/recovery-confirm', function (req, res) {
  try {
    let { password, code, token } = req.body

    if (!code || !password) {
      return res.status(400).json({
        message: 'You must enter all details.',
      })
    }

    const email = Confirm.getEmailByCode(code)

    if (!token) {
      token = Session.regenerateToken(email)
    }

    const session = Session.getForUser(token)

    if (!session) {
      return res.status(400).json({
        message: 'Error. You are not logged in.',
      })
    }

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

    const user = User.getByEmail(email)

    user.password = password

    return res.status(200).json(session)
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    })
  }
})

//====================================================

router.post('/balance', function (req, res) {
  try {
    const { token, currentEmail } = req.body

    if (!token) {
      token = Session.regenerateToken(currentEmail)
    }

    const user = User.getByEmail(currentEmail)

    if (!user) {
      return res.status(400).json({
        message: 'The user does not exist.',
      })
    }

    const session = Session.getForUser(token)

    if (!session) {
      return res.status(400).json({
        message:
          'No existing session for this user. Please, sign in.',
      })
    }

    return res.status(200).json({
      user: {
        balance: session.user.balance.toString(),
        transactions: Transaction.getListTransactions(),
      },
    })
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//====================================================

router.post('/settings', function (req, res) {
  try {
    const {
      currentEmail,
      token,
      newEmail,
      currentPassword,
      newPassword,
      oldPassword,
    } = req.body

    if (!token) {
      token = Session.regenerateToken(currentEmail)
    }

    const user = User.getByEmail(currentEmail)

    if (!user) {
      return res.status(400).json({
        message: 'The user does not exist.',
      })
    }

    const session = Session.getForUser(token)

    if (!session) {
      return res.status(400).json({
        message:
          'No existing session for this user. Please, sign in.',
      })
    }

    if (
      user.password === currentPassword ||
      user.password === oldPassword
    ) {
      if (newEmail && currentPassword) {
        user.email = newEmail
        session.user.email = newEmail
      } else if (newPassword && oldPassword) {
        user.password = newPassword
      } else {
        return res.status(400).json({
          message: 'You must enter all details.',
        })
      }
    } else {
      return res.status(400).json({
        message: 'Incorrect password',
      })
    }

    return res.status(200).json(session)
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//====================================================

router.post('/recive', function (req, res) {
  try {
    const {
      formattedNumericAmount,
      paymentSystem,
      token,
      currentEmail,
    } = req.body

    if (!token) {
      token = Session.regenerateToken(currentEmail)
    }

    const user = User.getByEmail(currentEmail)

    if (!user) {
      return res.status(400).json({
        message: 'The user does not exist.',
      })
    }

    const session = Session.getForUser(token)

    if (!session) {
      return res.status(400).json({
        message:
          'No existing session for this user. Please, sign in.',
      })
    }

    console.log(formattedNumericAmount)

    if (isNaN(formattedNumericAmount)) {
      return res.status(400).json({
        message:
          'Transaction failed. Please check your payment details and try again',
      })
    }

    if (
      formattedNumericAmount === 0 ||
      Math.abs(formattedNumericAmount) < Number.EPSILON
    ) {
      return res.status(400).json({
        message:
          'Please enter a valid amount greater than zero.',
      })
    }

    const transaction = Transaction.create(
      formattedNumericAmount,
      currentEmail,
      paymentSystem,
      'Recive',
    )

    console.log(transaction)

    Session.updateBalance(
      currentEmail,
      formattedNumericAmount,
    )

    console.log(session)

    return res.status(200).json(session)
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

module.exports = router
