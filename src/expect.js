/* eslint-disable no-param-reassign */

import throwAssertError from './error'
import checkType from './type'

const getKey = (name, key) => (name ? `${name}[${key}]` : key)

const expect = (params, expectation, name) =>
  Object.entries(expectation).forEach(([key, value]) => {
    const { processBeforeValidate } = value

    if (processBeforeValidate && typeof processBeforeValidate === 'function') {
      params[key] = processBeforeValidate(params[key], params)
    }

    const keyName = getKey(name, key)
    if (typeof value !== 'object') {
      if (params[key] === undefined || params[key] === null) {
        throwAssertError(`Bad request, ${keyName} is required`, value, 'required')
      }
      checkType(params[key], value, key, keyName, params)
      return
    }

    const { type, required = true, default: defaultVal, validate, schema, item, process, allowNull } = value

    if (params[key] === undefined || (params[key] === null && !allowNull)) {
      if (required === true || (typeof required === 'function' && required(params))) {
        if (defaultVal) {
          params[key] = typeof defaultVal === 'function' ? defaultVal(params) : defaultVal
        } else {
          throwAssertError(`Bad request, ${keyName} is required, no default value provided`, value, 'required')
        }
      } else {
        params[key] = typeof defaultVal === 'function' ? defaultVal(params) : defaultVal
        return
      }
    }

    if (params[key] !== null) {
      if (type) {
        checkType(params[key], type, key, keyName, params, value)
      }

      if (validate && !validate(params[key], params)) {
        throwAssertError(`Bad request, ${keyName} is invalid`, value, 'validate')
      }

      if (schema && typeof schema === 'object') {
        expect(params[key], schema, keyName)
      }

      if (type === Array && item) {
        expect(params[key], new Array(params[key].length).fill(item), keyName)
      }
    }

    if (process && typeof process === 'function') {
      params[key] = process(params[key], params)
    }
  })

export default expect
