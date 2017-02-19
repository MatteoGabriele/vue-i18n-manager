let proxies = {
  getTranslation: null,
  localStorage: window.localStorage
}

/**
 * Replaces functionalities with the plugin proxies
 * @param  {String} proxy - the property name
 * @param  {any} fn - the replacement
 */
export const assignProxy = function (proxy, fn) {
  proxies[proxy] = fn
}

export default proxies
