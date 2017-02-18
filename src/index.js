import events from './store/module/events'
import Store from './store'
import Locale from './locale'
import Router, { routeParser, registerRouter } from './router'

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
    ]).then(() => {
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

  Store(store)
  Locale(Vue, router, store)
  Router(Vue, router, store)

  Vue.initI18nManager = initializePlugin(Vue, options)
}

/**
 * Export helpers
 */
export { routeParser, events }
