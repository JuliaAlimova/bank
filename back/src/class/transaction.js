class Transaction {
  static #listTransactions = []
  static #count = 1

  constructor(
    amount,
    receiver,
    sender,
    srcLogo,
    transactionType,
  ) {
    this.id = Transaction.#count++
    this.amount = amount
    this.receiver = receiver
    this.sender = sender
    this.srcLogo = srcLogo
    this.transactionType = transactionType
    this.date = Transaction.formatDate()
  }

  static create = (
    amount,
    receiver,
    sender,
    srcLogo,
    transactionType,
  ) => {
    const transaction = new Transaction(
      amount,
      receiver,
      sender,
      srcLogo,
      transactionType,
    )

    this.#listTransactions.push(transaction)

    return transaction
  }

  static getTransaction = (id) => {
    return (
      this.#listTransactions.find(
        (item) => item.id === Number(id),
      ) || null
    )
  }

  static getListTransactionsForUser = (userEmail) => {
    return this.#listTransactions.filter(
      (transaction) => transaction.receiver === userEmail,
    )
  }

  static updateUserEmail = (oldEmail, newEmail) => {
    this.#listTransactions.forEach((transaction) => {
      if (transaction.receiver === oldEmail) {
        transaction.receiver = newEmail
      }
    })
  }

  static formatDate = () => {
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
