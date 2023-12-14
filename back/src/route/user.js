const express = require('express')

const router = express.Router()

const { User } = require('../class/user')
const { Session } = require('../class/session')
const { Confirm } = require('../class/confirm')
const { Transaction } = require('../class/transaction')
const { Notification } = require('../class/notification')

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
    let {
      email,
      password,
      token,
      srcLogo,
      actionType,
      notificationType,
    } = req.body

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

    Notification.create(
      email,
      srcLogo,
      actionType,
      notificationType,
    )

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
    let {
      password,
      code,
      token,
      srcLogo,
      actionType,
      notificationType,
    } = req.body

    if (!code || !password) {
      return res.status(400).json({
        message: 'You must enter all details.',
      })
    }

    const isCorrectConfirm = Confirm.getCode(code)

    if (!isCorrectConfirm) {
      return res.status(400).json({
        message: 'Invalid or expired code.',
      })
    }

    const email = Confirm.getEmailByCode(code)

    if (!token) {
      token = Session.regenerateToken(email)
    }

    const user = User.getByEmail(email)

    if (user.password === password) {
      return res.status(400).json({
        message:
          'New password must be different from the old password.',
      })
    } else {
      user.password = password
      Notification.create(
        email,
        srcLogo,
        actionType,
        notificationType,
      )
    }

    const session = Session.getForUser(token)

    if (!session) {
      return res.status(400).json({
        message: 'Error. You are not logged in.',
      })
    }

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
        transactions:
          Transaction.getListTransactionsForUser(
            currentEmail,
          ),
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
      srcLogo,
      actionType,
      notificationType,
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
        const emailExists = User.getByEmail(newEmail)
        if (emailExists) {
          return res.status(400).json({
            message:
              'The user with this email already exists.',
          })
        }
        if (newEmail === currentEmail) {
          return res.status(400).json({
            message:
              'The new email must be different from the current one.',
          })
        }
        user.email = newEmail
        session.user.email = newEmail
        Notification.updateUserEmail(currentEmail, newEmail)
        Transaction.updateUserEmail(currentEmail, newEmail)
        Confirm.updateEmail(currentEmail, newEmail)
      } else if (newPassword && oldPassword) {
        if (newPassword === oldPassword) {
          return res.status(400).json({
            message:
              'The new password must be different from the old one.',
          })
        }
        user.password = newPassword
      } else {
        return res.status(400).json({
          message: 'You must enter all details.',
        })
      }
    } else {
      return res.status(400).json({
        message: 'Incorrect password.',
      })
    }

    Notification.create(
      user.email,
      srcLogo,
      actionType,
      notificationType,
    )

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
      token,
      formattedNumericAmount,
      receiver,
      sender,
      srcLogoTransaction,
      srcLogoNotification,
      actionType,
      notificationType,
    } = req.body

    if (!token) {
      token = Session.regenerateToken(receiver)
    }

    const user = User.getByEmail(receiver)

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

    Transaction.create(
      formattedNumericAmount,
      receiver,
      sender,
      srcLogoTransaction,
      'Receipt',
    )

    Notification.create(
      receiver,
      srcLogoNotification,
      actionType,
      notificationType,
    )

    Session.updateBalance(
      receiver,
      formattedNumericAmount,
      'Receipt',
    )

    return res.status(200).json(session)
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//====================================================

router.post('/transaction', function (req, res) {
  try {
    const { token, currentEmail, transactionId } = req.body

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

    const transaction =
      Transaction.getTransaction(transactionId)

    if (transaction)
      return res.status(200).json(transaction)
    else {
      return res.status(400).json({
        message: 'Transaction not found',
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//====================================================

router.post('/notifications', function (req, res) {
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

    const notifications =
      Notification.getListNotificationsForUser(currentEmail)

    if (notifications)
      return res.status(200).json(notifications)
    else {
      return res.status(400).json({
        message: 'Notifications not found',
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

//====================================================

router.post('/send', function (req, res) {
  try {
    const {
      token,
      formattedNumericAmount,
      receiver,
      sender,
      srcLogoNotification,
      srcLogoTransaction,
      actionTypeSender,
      actionTypeReceiver,
      notificationTypeSender,
      notificationTypeReceiver,
    } = req.body

    if (!token) {
      token = Session.regenerateToken(sender)
    }

    const userSender = User.getByEmail(sender)

    if (!userSender) {
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

    if (!receiver || !formattedNumericAmount) {
      return res.status(400).json({
        message: 'You must enter all details.',
      })
    }

    if (sender === receiver) {
      return res.status(400).json({
        message: 'You cannot send money to yourself.',
      })
    }

    const senderBalance = Number(session.user.balance)

    if (senderBalance < formattedNumericAmount) {
      return res.status(400).json({
        message:
          'Insufficient funds. Please add funds to your account.',
      })
    }

    const userReceiver = User.getByEmail(receiver)

    if (!userReceiver) {
      return res.status(400).json({
        message:
          'User with the provided email address not found.',
      })
    }

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

    Transaction.create(
      formattedNumericAmount,
      sender,
      receiver,
      srcLogoTransaction,
      'Sending',
    )

    Transaction.create(
      formattedNumericAmount,
      receiver,
      sender,
      srcLogoTransaction,
      'Receipt',
    )

    Notification.create(
      sender,
      srcLogoNotification,
      actionTypeSender,
      notificationTypeSender,
    )

    Notification.create(
      receiver,
      srcLogoNotification,
      actionTypeReceiver,
      notificationTypeReceiver,
    )

    Session.updateBalance(
      sender,
      formattedNumericAmount,
      'Sending',
    )

    Session.updateBalance(
      receiver,
      formattedNumericAmount,
      'Receipt',
    )

    return res.status(200).json(session)
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    })
  }
})

module.exports = router
