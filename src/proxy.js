import { isBrowser } from './utils'

// localStorage mock avoids errors in SSR
const noop = () => {}
const localStorageMock = {
  getItem: noop,
  setItem: noop
}

export let proxies = {
  getTranslation: null,
  localStorage: isBrowser ? window.localStorage : localStorageMock
}

/**
 * Replaces functionalities with the plugin proxies
 * @param  {String} proxy - the property name
 * @param  {any} fn - the replacement
 */
const assignProxy = function (proxy, fn) {
  proxies[proxy] = fn
}

export default function (proxy) {
  if (!proxy) {
    return
  }

  const proxies = Object.keys(proxy)
  proxies.forEach(key => assignProxy(key, proxy[key]))
}
