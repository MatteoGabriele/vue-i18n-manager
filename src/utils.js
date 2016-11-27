export const pluginName = 'vue-i18n-manager'

/**
 * Guess what!?
 * @param  {String}  text
 * @param  {Boolean} [debug=true]
 */
export const warn = (text, debug = true) => {
  if (!debug) {
    return
  }

  /* eslint-disable */
  console.warn(`[${pluginName}] ${text}`)
  /* eslint-enable */
}

export const error = (text, debug = true) => {
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
export const getNamespace = (text) => {
  return `${pluginName}/${text}`
}

/**
 * Helper function that maps getters available in the store module
 * @param  {Array<String>} getters
 * @return {Object}
 */
export const mapGetters = (getters) => {
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
