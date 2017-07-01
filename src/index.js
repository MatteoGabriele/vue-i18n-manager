import { assert } from './utils'
import localeHandler from './locale'
import routerHandler, { routeParser } from './router'
import proxyHandler from './proxy'
import storeModule, { changeSettings } from './store'
import { defineOptionsKeys } from './format'

/**
 * Expose the install function to let Vue install the plugin
 * @param  {Vue} Vue
 * @param  {Object} [options={}] - plugin options
 */
export default function install (Vue, options = {}) {
  const { router, store, config } = options

  assert(store, 'vuex store instance is mandatory.')

  defineOptionsKeys(options)

  localeHandler(Vue, { store, router })
  proxyHandler(options.proxy)

  store.registerModule('i18n', storeModule)

  store.dispatch(changeSettings(config)).then(() => {
    // Register router after store state is updated
    routerHandler(Vue, { router, store })
  })
}

/**
 * Export helpers
 */
export { routeParser }
