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

  const style = 'padding: 10px; font-size: 10px; line-height: 30px;'

  const normal = `${style} background: #333333; color: #f9f9f9`
  const success = `${style} background: #219621; color: #ffffff`
  const warning = `${style} background: #f1e05a; color: #333333`
  const error = `${style} background: #b9090b; color: #ffffff`
  const types = { normal, error, success, warning }

  /* eslint-disable */
  console.log(`%c[VueI18nManager] ${text}`, types[type])
  /* eslint-enable */
}
