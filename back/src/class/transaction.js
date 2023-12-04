class Transaction {
  static #listTransactions = []

  static #count = 1

  constructor(amount, userEmail, source, transactionType) {
    this.id = Transaction.#count++
    this.amount = amount
    this.userEmail = userEmail
    this.source = source
    this.transactionType = transactionType
    this.date = this.formatDate()
  }

  static create = (
    amount,
    userEmail,
    source,
    transactionType,
  ) => {
    const transaction = new Transaction(
      amount,
      userEmail,
      source,
      transactionType,
    )

    this.#listTransactions.push(transaction)

    return transaction
  }

  static getTransaction = (id) => {
    return (
      this.#listTransactions.find(
        (item) => item.id === id,
      ) || null
    )
  }

  static getListTransactions = () => this.#listTransactions

  formatDate = () => {
    const date = new Date()
    const day = date.getDate()
    const month = date.toLocaleString('en-US', {
      month: 'short',
    })
    const time = date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: 'numeric',
    })

    return `${day} ${month}, ${time}`
  }
}

module.exports = { Transaction }
