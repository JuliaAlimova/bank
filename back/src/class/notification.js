class Notification {
  static #listNotifications = []
  static #count = 1

  constructor(
    userEmail,
    srcLogo,
    actionType,
    notificationType,
  ) {
    this.id = Notification.#count++
    this.userEmail = userEmail
    this.date = new Date()
    this.srcLogo = srcLogo
    this.actionType = actionType
    this.notificationType = notificationType
  }

  static create = (
    userEmail,
    srcLogo,
    actionType,
    notificationType,
  ) => {
    const notification = new Notification(
      userEmail,
      srcLogo,
      actionType,
      notificationType,
    )

    this.#listNotifications.push(notification)

    return notification
  }

  static getNotification = (id) => {
    return (
      this.#listNotifications.find(
        (item) => item.id === Number(id),
      ) || null
    )
  }

  static getListNotificationsForUser = (userEmail) => {
    return this.#listNotifications.filter(
      (notification) =>
        notification.userEmail === userEmail,
    )
  }

  static updateUserEmail = (oldEmail, newEmail) => {
    this.#listNotifications.forEach((notification) => {
      if (notification.userEmail === oldEmail) {
        notification.userEmail = newEmail
      }
    })
  }
}

module.exports = { Notification }
