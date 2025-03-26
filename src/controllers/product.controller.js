'use strict'

const { SuccessResponse, CREATED_RESPONSE } = require("../core/success.response");
const ProductService = require('../services/product.service');

class ProductController {

  createProduct = async (req, res, next) => {
    new CREATED_RESPONSE({
      message: 'Create product success!',
      metadata: await ProductService.sCreateProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  }

  /**
   * @desc get all product drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   * 
   */
  // query
  getAllProductDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all product draft success!',
      metadata: await ProductService.sFindAllProductDraftForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  getAllProductPublishedForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get all product published success!',
      metadata: await ProductService.sFindAllProductPublishedForShop({
        product_shop: req.user.userId
      })
    }).send(res)
  }

  publishProductForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Published product success!',
      metadata: await ProductService.sPublishProductForShop({
        product_shop: req.user.userId,
        product_id: req.params.productId
      })
    }).send(res)
  }

  unPublishProductForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'UnPublished product success!',
      metadata: await ProductService.sUnPublishProductForShop({
        product_shop: req.user.userId,
        product_id: req.params.productId
      })
    }).send(res)
  }

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'getListSearchProduct success!',
      metadata: await ProductService.sSearchProducts(req.params)
    }).send(res)
  }

  findAllProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Find all product success!',
      metadata: await ProductService.sFindAllProducts(req.query)
    }).send(res)
  }

  findProductDetail = async (req, res, next) => {
    new SuccessResponse({
      message: 'Find product detail success!',
      metadata: await ProductService.sFindProduct({ product_id: req.params.productId })
    }).send(res)
  }

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Update product success!',
      metadata: await ProductService.sUpdateProduct(req.body.product_type, req.params.productId, { ...req.body, product_shop: req.user.userId })
    }).send(res)
  }
}

module.exports = new ProductController()