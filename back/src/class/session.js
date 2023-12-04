class Session {
  static #list = []

  constructor(user) {
    this.token = Session.generateCode()
    this.user = {
      email: user.email,
      isConfirm: user.isConfirm,
      isLogged: user.isLogged,
      id: user.id,
      balance: 0,
    }
  }

  static generateCode = () => {
    const length = 6
    const characters =
      'ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''

    for (let index = 0; index < length; index++) {
      const randomIndex = Math.floor(
        Math.random() * characters.length,
      )
      result += characters[randomIndex]
    }

    return result
  }

  static create = (user) => {
    const session = new Session(user)

    this.#list.push(session)

    return session
  }

  static getForUser = (token) => {
    return (
      this.#list.find((item) => item.token === token) ||
      null
    )
  }

  static regenerateToken = (email) => {
    const existingSession = this.#list.find(
      (item) =>
        item.user.email === String(email).toLowerCase(),
    )

    if (existingSession) {
      existingSession.token = Session.generateCode()
      return existingSession.token
    }

    return null
  }

  static updateBalance(userEmail, amount) {
    const session = this.#list.find(
      (session) =>
        session.user.email ===
        String(userEmail).toLowerCase(),
    )

    if (session) {
      const newBalance = (
        Number(session.user.balance) + Number(amount)
      ).toFixed(2)
      session.user.balance = newBalance
      return newBalance
    }

    return null
  }

  static getList = () => this.#list
}

module.exports = { Session }
