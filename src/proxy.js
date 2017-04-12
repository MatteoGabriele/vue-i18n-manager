import { getLocalStorage } from './utils'

let proxies = {
  getTranslation: null,
  localStorage: getLocalStorage()
}

/**
 * Replaces functionalities with the plugin proxies
 * @param  {String} proxy - the property name
 * @param  {any} fn - the replacement
 */
export function assignProxy (proxy, fn) {
  proxies[proxy] = fn
}

export default proxies
