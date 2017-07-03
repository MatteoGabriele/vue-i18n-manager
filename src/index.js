import { isDef } from './utils'
import localeHandler from './locale'
import routerHandler, { routeParser } from './router'
import proxyHandler from './proxy'
import storeModule from './store'
import { changeSettings } from './store'
import { defineOptionsKeys } from './format'

/**
 * Expose the install function to let Vue install the plugin
 * @param  {Vue} Vue
 * @param  {Object} [options={}] - plugin options
 */
export default function install (Vue, options = {}) {
  const { router, store, config } = options

  if (!isDef(store)) {
    throw new Error(
      '[vue-i18n-manager] Missing Vuex store instance in the plugin configuration object.'
    )
  }

  // extra check on the shape of the configuration object
  // if the data added is not part of the spec, it throws a warning
  defineOptionsKeys(options)

  localeHandler(Vue, { store, router })
  proxyHandler(options.proxy)

  store.registerModule('i18n', storeModule)

  store.dispatch(changeSettings(config)).then(() => {
    // Register router after store state is updated
    // routerHandler(Vue, { router, store })
  })
}

/**
 * Export helpers
 */
export { routeParser }
