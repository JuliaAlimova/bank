class Confirm {
  static #list = []

  constructor(data) {
    this.code = Confirm.generateCode()
    this.email = data
  }

  static generateCode = () => {
    return Math.floor(Math.random() * 9000) + 1000
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

  static getData = (code) => {
    const codeNumber = Number(code)
    const obj = this.#list.find(
      (item) => item.code === codeNumber,
    )

    return obj ? obj.email : null
  }

  static getList = () => this.#list
}

module.exports = { Confirm }
