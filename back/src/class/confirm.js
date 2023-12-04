class Confirm {
  static #list = []

  constructor(data) {
    this.code = Confirm.generateCode()
    this.email = data
  }

  static generateCode = () => {
    return Math.floor(Math.random() * 900000) + 100000
  }

  static create = (data) => {
    const confirmInstance = new Confirm(data)

    this.#list.push(confirmInstance)

    setTimeout(() => {
      this.delete(confirmInstance.code)
    }, 24 * 60 * 60 * 1000)
  }

  static delete = (code) => {
    const length = this.#list.length

    this.#list = this.#list.filter(
      (item) => item.code !== code,
    )

    return length > this.#list.length
  }

  static getEmailByCode = (code) => {
    const obj = this.#list.find(
      (item) => item.code === Number(code),
    )

    return obj ? obj.email : null
  }

  static getByEmail = (email) => {
    return (
      this.#list.find((item) => item.email === email) ||
      null
    )
  }

  static regenerateCode = (email) => {
    const existingConfirm = this.#list.find(
      (item) => item.email === String(email).toLowerCase(),
    )

    if (existingConfirm) {
      const newCode = Confirm.generateCode()

      existingConfirm.code = newCode

      return newCode
    }

    return null
  }

  static getList = () => this.#list
}

module.exports = { Confirm }
