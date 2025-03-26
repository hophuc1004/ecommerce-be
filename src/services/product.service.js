
'use strict'

const { BadRequestError } = require("../core/error.response");
const { clothes, electronics, products: productModel, furnitures } = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const { rFindAllProductDraftForShop, rFindAllProductPublishedForShop, rPublishProductForShop, rUnPublishProductForShop, rSearchProductByUser, rFindAllProducts, rFindProduct, updateProductById } = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { sPushNotiToSystem } = require("./notification.service");
const productTypes = require('../shared/helper/product.config')

// define factory class to create product
class ProductFactory {

  /**
   * type: clothing, electronic
   * payload
   */

  // Level switch, you need to edit code at here when you add new product type

  /*
  static async createProduct(product_type, payload) {
    switch (product_type) {
      case 'Clothes':
        return new Clothes(payload).createProduct();

      case 'Electronics':
        return new Electronics(payload).createProduct();

      default:
        throw new BadRequestError(`Invalid product types:: ${product_type}`)
    }
  }
  */

  // Level another, do not edit code at here when you add new product type
  // 1. Create model Furniture Schema
  // 2. Take Strategy:
  static productRegistry = {} // object contain key-class

  static sRegisterProductType(product_type, classRef) {
    ProductFactory.productRegistry[product_type] = classRef;
    console.log('productRegistry:', this.productRegistry)
  }

  static async sCreateProduct(product_type, payload) {
    console.log('000000000');
    console.log('AAAAAAAA::: ', ProductFactory.productRegistry);
    console.log('product_type:', product_type)
    console.log('payload:', payload)
    const productClass = ProductFactory.productRegistry[product_type];
    console.log('productClass:', productClass)
    console.log('BBBBBBB::: ', ProductFactory.productRegistry);

    if (!productClass) throw new BadRequestError(`Invalid Product Types ${product_type}`);

    return new productClass(payload).createProduct();
  }


  static async sUpdateProduct(product_type, productId, payload) {
    const productClass = ProductFactory.productRegistry[product_type];
    if (!productClass) throw new BadRequestError(`Invalid Product Types ${product_type}`);

    return new productClass(payload).updateProduct(productId);
  }


  // query
  static async sFindAllProductDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, is_draft: true };

    return await rFindAllProductDraftForShop({ query, limit, skip });
  }

  static async sFindAllProductPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, is_published: true };

    return await rFindAllProductPublishedForShop({ query, limit, skip });
  }

  // 
  static async sPublishProductForShop({ product_shop, product_id }) {
    return await rPublishProductForShop({ product_shop, product_id });
  }

  static async sUnPublishProductForShop({ product_shop, product_id }) {
    return await rUnPublishProductForShop({ product_shop, product_id });
  }

  static async sSearchProducts({ keySearch }) {
    return await rSearchProductByUser({ keySearch });
  }

  static async sFindAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { is_published: true }, select }) {
    return await rFindAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
    });
  }

  static async sFindProduct({ product_id }) {
    return await rFindProduct({ product_id, unSelect: ['__v'] });
  }

}

// define base Product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_type,
    product_shop,
    product_attributes,
    product_quantity,
    product_location
  }) {

    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_quantity = product_quantity;
    this.product_location = product_location
  }

  // create new Product
  // for parent
  async createProductParent(productId) {
    console.log('2222222');
    const newProduct = await productModel.create({ ...this, _id: productId });
    if (newProduct) {
      // add product_stock in inventory collection
      await insertInventory({
        productId: newProduct._id,
        stock: this.product_quantity,
        shopId: this.product_shop,
        location: this.product_location
      })

      // push noti to system collection
      sPushNotiToSystem({
        type: 'SHOP-001',
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop
        }
      })
        .then(res => console.log(res))
        .catch(console.error)
    }

    return newProduct;
  }

  // update product parent
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: productModel });
  }
}

// define sub-class for different product type
// Clothes
class Clothes extends Product {
  async createProduct() {
    console.log('111111111');
    console.log('111111111this.product_shop:', this.product_shop)
    const newClothing = await clothes.create({ ...this.product_attributes, product_shop: this.product_shop });

    if (!newClothing) throw new BadRequestError('Create newClothing error!');

    const newProduct = await super.createProductParent(newClothing._id); // for parent
    if (!newProduct) throw new BadRequestError('Create newProduct error!');

    return newProduct;
  }

  async updateProduct(productId) {
    //1. Remove attribute have null or undefined value
    const updateNest = updateNestedObjectParser(this);
    //2. Remove null and undefined if user pass undefined value for field
    const objectParams = removeUndefinedObject(updateNest);
    //3. Check where need update
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: clothes });
    }
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct;
  }
}

// electronic
class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronics.create({ ...this.product_attributes, product_shop: this.product_shop });

    if (!newElectronic) throw new BadRequestError('Create newElectronic error!');

    const newProduct = await super.createProductParent(newElectronic._id); // for parent
    if (!newProduct) throw new BadRequestError('Create newProduct error!');

    return newProduct;
  }

  async updateProduct(productId, bodyUpdate) {
    //1. Remove attribute have null or undefined value
    const updateNest = updateNestedObjectParser(this);
    //2. Remove null and undefined if user pass undefined value for field
    const objectParams = removeUndefinedObject(updateNest);
    //3. Check where need update
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: electronics });
    }
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct;
  }
}

// furniture
class Furnitures extends Product {
  async createProduct() {
    const newFurniture = await furnitures.create({ ...this.product_attributes, product_shop: this.product_shop });

    if (!newFurniture) throw new BadRequestError('Create newFurniture error!');

    const newProduct = await super.createProductParent(newFurniture._id); // for parent
    if (!newProduct) throw new BadRequestError('Create newProduct error!');

    return newProduct;

  }

  async updateProduct(productId, bodyUpdate) {
    //1. Remove attribute have null or undefined value
    const updateNest = updateNestedObjectParser(this);
    //2. Remove null and undefined if user pass undefined value for field
    const objectParams = removeUndefinedObject(updateNest);
    //3. Check where need update
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({ productId, bodyUpdate: updateNestedObjectParser(objectParams.product_attributes), model: furnitures });
    }
    // update parent
    const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams));
    return updateProduct;
  }
}

// register product types
for (const key in productTypes) {
  console.log('key:', key)
  // ProductFactory.sRegisterProductType(key, key); // for add or remove a lot of productTypes
}

ProductFactory.sRegisterProductType('Electronics', Electronics);
ProductFactory.sRegisterProductType('Clothes', Clothes);
ProductFactory.sRegisterProductType('Furnitures', Furnitures);

module.exports = ProductFactory;