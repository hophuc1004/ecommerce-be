'use strict'

const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {

  // if not login yet or already login
  /*
    {
      cartId,
      userId,
      shop_order_ids: [
        {
          shopId,
          shop_discounts: [],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        },
        {
          shopId,
          shop_discounts: [
            {
              shopId,
              discountId,
              codeId
            }
          ],
          item_products: [
            {
              price,
              quantity,
              productId
            }
          ]
        }
      ]
    }
  */
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check cartId is exist
    const foundCart = await findCartById(cartId);

    if (!foundCart) throw new BadRequestError('Cart does not exist!');

    const checkoutOrder = {
      totalPrice: 0, // total of all product
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0 // all to pay
    };

    const shop_order_ids_new = [];

    // all bill
    for (let index = 0; index < shop_order_ids.length; index++) {
      const elementShopOrder = shop_order_ids[index];
      const { shopId, shop_discounts = [], item_products = [] } = elementShopOrder;

      // check product available
      const checkProductServer = await checkProductByServer(item_products);

      if (!checkProductServer[0]) throw new BadRequestError('Order wrong!');


      // all money of order
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + (product.quantity * product.price);
      }, 0);

      // all money before handle
      checkoutOrder.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // the money before discount
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer
      };

      // if shop_discounts already exist > 0, check invalid or not
      if (shop_discounts.length > 0) {
        // example only have one discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer
        })

        // total price discount
        checkoutOrder.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount
        }
      }

      // total final user pay
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkoutOrder
    }
  }

  // order
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {}
  }) {
    const { shop_order_ids_new, checkoutOrder } = await CheckoutService.checkoutReview({ cartId, userId, shop_order_ids });

    // check again one more xem co vuot ton kho hay khong?

    const products = shop_order_ids_new.flatMap(order => order.item_products);

    console.log(`[1]::::: `, products);

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
    }

  }

}

module.exports = CheckoutService;