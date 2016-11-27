import keys from 'lodash/keys'
import each from 'lodash/each'

import events from './store/module/events'
import Store from './store'
import Locale from './locale'
import Router, { routeParser } from './router'
import Component from './component'

/**
 * Install components
 * It will install all components listed in the component index file.
 * All components will be already available in the application without needs
 * to imports
 * @param  {Vue} Vue
 */
const installComponents = (Vue) => {
  const components = Component(Vue)
  each(keys(components), name => {
    Vue.component(name, components[name])
  })
}

/**
 * Initialize plugin
 * @param  {Store} store
 * @param  {Object} config - plugin configuration options
 * @return {Promise}
 */
const initializePlugin = (Vue, { store, router, config }) => {
  return async function () {
    await store.dispatch(events.UPDATE_CONFIGURATION, config)
    await store.dispatch(events.SET_LANGUAGE, store.getters.defaultCode)

    Router(Vue, router, store)
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
  installComponents(Vue)

  Vue.initI18nManager = initializePlugin(Vue, options)
}

/**
 * Export helpers
 */
export { routeParser, events }
