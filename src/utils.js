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

/**
 * Returns the namespace of the plugin
 * @param  {String} text
 * @return {String}
 */
export const getNamespace = (text) => {
  return `${pluginName}/${text}`
}
