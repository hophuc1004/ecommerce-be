'use strict'

const { SuccessResponse } = require("../core/success.response")
const { sListNotiByUser } = require("../services/notification.service")

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list notification success!',
      metadata: await sListNotiByUser(req.query)
    }).send(res)
  }
}

module.exports = new NotificationController();