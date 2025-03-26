'use strict'

const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repositories/product.repo");

/*
  Key feature: Cart Service
  - add product to cart [user]
  - reduce product quantity by one [user]
  - increase product quantity by one [user]
  - get cart [user]
  - delete cart [user]
  - delete cart item [user]
*/

class CartService {

  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product
      }
    };
    const options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options).lean();
  }

  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      'cart_products.productId': productId,
      cart_state: 'active'
    };

    const updateSet = {
      $inc: {
        'cart_products.$.quantity': quantity
      }
    };

    const options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product = {} }) {
    // check cart exist
    const userCart = await cartModel.findOne({ cart_userId: userId });

    if (!userCart) {
      // create cart for user
      return await CartService.createUserCart({ userId, product });
    }

    // if already have cart but no product
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    if (userCart.cart_products.find(productItem => productItem.productId !== product.productId)) {
      userCart.cart_products.push(product);
      return userCart.save()
    }

    // if already have cart and have product -> increase same product, add new product to cart
    return await CartService.updateUserCartQuantity({ userId, product });

  }

  // update cart
  /*
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
            shopId,
            productId,
            price,
            quantity,
            old_quantity
          }
        ],
        version
      }
    ]
  */

  static async addToCartV2({ userId, shop_order_ids }) { // v1 add to cart, v

    const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];

    // check product exist
    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFoundError('Product not found!');

    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError('Product do not belong to the shop!');
    }

    if (quantity === 0) {
      // deleted
    }

    return await CartService.updateUserCartQuantity({
      userId, product: {
        productId,
        quantity: quantity - old_quantity
      }
    })
  }

  static async deleteItemInCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: 'active' };
    const updateSet = {
      $pull: {
        cart_products: {
          productId
        }
      }
    }

    const deleteCart = await cartModel.updateOne(query, updateSet);
    return deleteCart;
  }

  static async getListProductUserCart({ userId }) {
    return await cartModel.findOne({
      cart_userId: +userId
    }).lean();
  }
}

module.exports = CartService;