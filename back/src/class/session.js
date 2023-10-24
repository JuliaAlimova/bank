class Session {
  static #list = []

  constructor(user) {
    this.token = Session.generateCode()
    this.user = {
      email: user.email,
      isConfirm: user.isConfirm,
      id: user.id,
    }
    this.isLogged = false
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

  static get = (token) => {
    return (
      this.#list.find((item) => item.token === token) ||
      null
    )
  }

  static getList = () => this.#list
}

module.exports = { Session }
