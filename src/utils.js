export const pluginName = 'vue-i18n-manager'

export const warn = (text, debug = true) => {
  if (!debug) {
    return
  }

  /* eslint-disable */
  console.warn(`[${pluginName}] ${text}`)
  /* eslint-enable */
}

export const getNamespace = (string) => {
  return `${pluginName}/${string}`
}
