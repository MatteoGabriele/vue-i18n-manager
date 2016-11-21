export const warn = (text, debug = true) => {
  if (!debug) {
    return
  }

  /* eslint-disable */
  console.warn(`[vue-i18n-manager] ${text}`)
  /* eslint-enable */
}
