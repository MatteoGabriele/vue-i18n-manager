export const pluginName = 'vue-i18n-manager'

/**
 * Guess what!?
 * @param  {String}  text
 * @param  {Boolean} [debug=true]
 */
export function warn (text, debug = true) {
  if (!debug) {
    return
  }

  /* eslint-disable */
  console.warn(`[${pluginName}] ${text}`)
  /* eslint-enable */
}

/**
 * Returns is the window object is available
 * @return {Boolean} [description]
 */
export function isBrowser () {
  return typeof window !== 'undefined'
}

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

export function error (text, debug = true) {
  if (!debug) {
    return
  }

  /* eslint-disable */
  console.error(`[${pluginName}] ${text}`)
  /* eslint-enable */
}

/**
 * Returns the namespace of the plugin
 * @param  {String} text
 * @return {String}
 */
export function getNamespace (text) {
  return `${pluginName}/${text}`
}

/**
 * Helper function that maps getters available in the store module
 * @param  {Array<String>} getters
 * @return {Object}
 */
export function mapGetters (getters) {
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
