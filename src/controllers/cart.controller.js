'use strict'

const { SuccessResponse } = require("../core/success.response")
const CartService = require("../services/cart.service")

class CartController {
  // new
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create new Cart success!',
      metadata: await CartService.addToCart(req.body)
    }).send(res)
  }

  // update + -
  updateCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update Cart success!',
      metadata: await CartService.addToCartV2(req.body)
    }).send(res)
  }

  deleteCart = async (req, res, next) => {
    new SuccessResponse({
      message: 'Delete Cart success!',
      metadata: await CartService.deleteItemInCart(req.body)
    }).send(res)
  }

  listProductUserCart = async (req, res, next) => { // list product that user order into cart
    new SuccessResponse({
      message: 'Get list user cart success!',
      metadata: await CartService.getListProductUserCart(req.query)
    }).send(res)
  }
}

module.exports = new CartController();