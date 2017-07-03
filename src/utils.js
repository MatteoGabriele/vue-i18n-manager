export const pluginName = 'vue-i18n-manager'

/**
 * Guess what!?
 * @param  {String}  text
 * @param  {Boolean} [debug=true]
 */
export function warn (text) {
  /* eslint-disable */
  console.warn(`[${pluginName}] ${text}`)
  /* eslint-enable */
}

export function findItem (value, list, fallback) {
  return list.find(item => {
    return Object.keys(item)
      .find(prop => item[prop] === value)
  }) || fallback
}

/**
 * @param  {any}  value
 * @return {Boolean}
 * @description Checks if a value is defined
 */
export function isDef (value) {
  return typeof value !== 'undefined'
}

export function applyIfDef (value, fallback) {
  return isDef(value) ? value : fallback
}

/**
 * Returns is the window object is available
 * @return {Boolean}
 */
export const isBrowser = isDef(window)
