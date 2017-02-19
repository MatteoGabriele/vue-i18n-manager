let proxies = {
  getTranslation: null
}

export const assignProxy = function (proxy, fn) {
  proxies[proxy] = fn
}

export default proxies
