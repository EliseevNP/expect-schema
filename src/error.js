class InputSchemaError extends Error {
  constructor(message, status = 500) {
    super()
    this.name = 'InputSchemaError'
    this.message = message
    this.status = status
    this.expose = true
  }
}

const throwAssertError = (message, expectation, type) => {
  const e = (expectation && expectation.error && type && expectation.error[type]) || {}
  throw new InputSchemaError((typeof e === 'string' && e) || e.message || message, e.status || 400)
}

export default throwAssertError
