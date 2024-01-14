'use strict'

const { SuccessResponse } = require("../core/success.response")
const CommentService = require("../services/comment.service")

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create comment success!',
      metadata: CommentService.sCreateComment(req.body)
    }).send(res)
  }

  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get comment success!',
      metadata: await CommentService.sGetCommentsByParentId(req.query)
    }).send(res)
  }

  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete comment success!',
      metadata: await CommentService.sDeleteComments(req.query)
    }).send(res)
  }
}

module.exports = new CommentController();