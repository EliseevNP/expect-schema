import throwAssertError from './error'

export default (value, requiredType, key, keyName, params, expectation) => {
  const throwTypeError = (message) => throwAssertError(message, expectation, 'type')

  if (typeof requiredType !== 'function') {
    // eslint-disable-next-line max-len
    throwTypeError(`Bad request, type [${requiredType}] doesn't exist, please provide type as function`)
  }

  if (requiredType === Array && !Array.isArray(value)) {
    throwTypeError(`Bad request, ${keyName} should be array, but found ${typeof value}`)
  }

  if (requiredType === Number) {
    if (Number.isNaN(value)) {
      throwTypeError(`Bad request, ${keyName} is NaN`)
    }

    if (!Number.isNaN(Number(value)) && !Array.isArray(value)) {
      // eslint-disable-next-line  no-param-reassign
      params[key] = Number(value)
      return
    }
  }

  if (typeof value !== typeof requiredType()) {
    // eslint-disable-next-line max-len
    throwTypeError(
      `Bad request, ${keyName} should have a type of ${typeof requiredType()}, but found ${
        (Array.isArray(value) && 'array') || typeof value
      }`,
    )
  }
}
