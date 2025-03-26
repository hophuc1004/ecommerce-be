// contain function, class, feature that we usually use
'use strict'
const crypto = require('crypto');

const { isNull, isArray } = require('lodash');
const pick = require('lodash/pick');
const { Types } = require('mongoose');

const getIntoData = ({ fields = [], object = {} }) => {
  const result = pick(object, fields);
  return result;
}

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(ele => [ele, 1]));
}

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map(ele => [ele, 0]));
}

const convertToObjectIdMongoDb = (id) => new Types.ObjectId(id);

const removeUndefinedObject = (object = {}) => {
  Object.keys(object).forEach(key => {
    if (isNull(object[key])) {
      delete object[key];
    }
  })
  return object;
}

/*
const objExample = {
  a: {
    b: 1,
    c: 2
  },
  d: 3
}

expect:
a.b: 1,
a.c: 2,
d: 3
*/

const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj || {}).forEach(key => {
    if (typeof obj[key] === 'object' && !isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key]) || {};
      Object.keys(response || {}).forEach(k => {
        final[`${key}.${k}`] = response[k];
      })
    }
  })

  return final;
}

const randomImageName = () => crypto.randomBytes(16).toString('hex');

module.exports = {
  getIntoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongoDb,
  randomImageName
}