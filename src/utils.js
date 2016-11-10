/**
 * Logger for different type of messages.
 * @param  {String} text
 * @param  {String} [type='success']
 * @param  {Boolean} [debug=true]
 */
export const log = (text, type = 'normal', debug = true) => {
  if (!debug) {
    return
  }

  const name = '[vue-i18n-manager]'
  const style = 'padding: 10px; font-size: 9.5px; line-height: 30px;'
  const normal = `${style} background: #333333; color: #f9f9f9`
  const success = `${style} background: #219621; color: #ffffff`
  const warning = `${style} background: #f1e05a; color: #333333`
  const error = `${style} background: #b9090b; color: #ffffff`
  const types = { normal, error, success, warning }

  if (type === 'error') {
    throw new Error(`${name} ${text}`)
  }

  /* eslint-disable */
  console.log(`%c${name} ${text}`, types[type])
  /* eslint-enable */
}

export function has (object, key) {
  let keys = key.split('.')
  let result = object

  keys.forEach((k) => {
    if (result) {
      result = result[k]
    }
  })

  return typeof result !== 'undefined'
}
