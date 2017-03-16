import events from './store/module/events'
import Store from './store'
import Locale from './locale'
import Router, { routeParser, registerRouter } from './router'
import { assignProxy } from './proxy'
import { defineKeys } from './format'

/**
 * Initialize plugin
 * @param  {Store} store
 * @param  {Object} config - plugin configuration options
 * @return {Promise}
 */
const initializePlugin = (Vue, { store, router, config }) => {
  return function () {
    return Promise.all([
      store.dispatch(events.UPDATE_CONFIGURATION, config),
      store.dispatch(events.SET_LANGUAGE, store.getters.defaultCode)
    ]).then((res) => {
      // Router needs to be registered after the store is fully setup
      registerRouter(router, store)
    })
  }
}

/**
 * Expose the install function to let Vue install the plugin
 * @param  {Vue} Vue
 * @param  {Object} [options={}] - plugin options
 */
export default function install (Vue, options = {}) {
  const { router, store } = options

  // check if the options object is respecting the configuration
  defineKeys(
    Object.keys(options),
    ['store', 'router', 'config', 'proxy'],
    'plugin configuration'
  )

  Store(store)
  Locale(Vue, router, store)
  Router(Vue, router, store)

  if (options.proxy) {
    const proxies = Object.keys(options.proxy)
    proxies.forEach(key => assignProxy(key, options.proxy[key]))
  }

  Vue.initI18nManager = initializePlugin(Vue, options)
}

/**
 * Export helpers
 */
export { routeParser, events }
