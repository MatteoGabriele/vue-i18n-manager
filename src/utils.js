/**
 * Logger for different type of messages.
 * @param  {String} text
 * @param  {String} [type='success']
 * @param  {Boolean} [debug=true]
 */
export const log = (text, type = 'log', debug = true) => {
  if (!debug) {
    return
  }

  /* eslint-disable */
  console[type](`[vue-i18n-manager] ${text}`)
  /* eslint-enable */
}
