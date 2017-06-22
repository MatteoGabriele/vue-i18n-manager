import Locale from './locale'
import Router, { routeParser, registerRouter } from './router'
import storeModule, { changeSettings } from 'module'

/**
 * Expose the install function to let Vue install the plugin
 * @param  {Vue} Vue
 * @param  {Object} [options={}] - plugin options
 */
export default function install (Vue, options = {}) {
  const { router, store, config } = options

  Locale(Vue, router, store)
  Router(Vue, router, store)

  store.registerModule('i18n', storeModule)

  store.dispatch(changeSettings(config)).then(() => {
    // Register router after store state is updated
    registerRouter(router, store)
  })
}

/**
 * Export helpers
 */
export { routeParser }
