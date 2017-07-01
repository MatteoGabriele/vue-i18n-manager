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
 * Returns is the window object is available
 * @return {Boolean} [description]
 */
export const isBrowser = (typeof window !== 'undefined')

/**
 * Return localStorage if available or mock it in case we are running on a node env
 * @return {Object}
 */
export function getLocalStorage () {
  if (isBrowser) {
    return window.localStorage
  }

  const noop = function () { /* emptiness */ }

  return {
    getItem: noop,
    setItem: noop,
    remove: noop,
    clear: noop
  }
}

export function assert (test, text) {
  if (typeof test !== 'undefined') {
    return
  }

  throw new Error(`[${pluginName}] ${text}`)
}

/**
 * Returns the namespace of the plugin
 * @param  {String} text
 * @return {String}
 */
export const getNamespace = function (text) {
  return `${pluginName}/${text}`
}

/**
 * Helper function that maps getters available in the store module
 * @param  {Array<String>} getters
 * @return {Object}
 */
export const mapGetters = function (getters) {
  let res = {}
  getters.forEach(key => {
    res[key] = function () {
      if (typeof this.$store.getters[key] === 'undefined') {
        warn(`Unknown getter: "${key}"`)
      }
      return this.$store.getters[key]
    }
  })
  return res
}
