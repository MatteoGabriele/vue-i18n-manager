import translationTool from './component/translationTool'
import { UPDATE_I18N_STATE, SET_LANGUAGE } from './store/module/events'

import routerHandler, { routeParser } from './router'
import storeHandler from './store'
import localeHandler from './locale'

class I18n {
  constructor (Vue, { store, router, config }) {
    this.$vue = Vue
    this.$config = config
    this.$store = store

    this.$storeHandler = storeHandler(store)
    this.$localeHandler = localeHandler(Vue)
    this.$routerHandler = routerHandler(Vue, router, store)
  }

  /**
   * Update plugin state.
   * Updates the module default state merging it with the plugin config options
   */
  async updatePluginState () {
    await this.$store.dispatch(UPDATE_I18N_STATE, this.$config)
  }

  /**
   * Set language
   * It sets the new requested language, replaces the url prefix in the url
   * and returns translations which are then applyed using vue-i18n.
   * If no language is passed, the language will be the one choosen as default
   * @param {String} [code=defaultCode]
   * @param {Boolean} [replaceRoute=true]
   * @return {Promise}
   */
  async setLanguage (code = this.$store.getters.defaultCode, replaceRoute = true) {
    const translations = await this.$store.dispatch(SET_LANGUAGE, code)

    this.$localeHandler.update(code, translations)

    if (!replaceRoute) {
      return
    }

    this.$routerHandler.updateURL()
  }

  /**
   * Initialize the plugin mutations
   */
  async init () {
    // Register the i18n module to the application store
    this.$storeHandler.register()

    // Merge configuration from the plugin options with the module default state
    await this.updatePluginState()

    // Set the current language and translations
    await this.setLanguage()

    // Start managing routes
    this.$routerHandler.register()
  }
}

/**
 * Utilities exports
 */
export {
  routeParser,
  translationTool
}

/**
 * Expose the install function to let Vue install the pm plugin
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
export default function install (Vue, options = {}) {
  const instance = new I18n(Vue, options)

  Vue.$i18n = instance

  Vue.prototype.$setLanguage = instance.setLanguage.bind(instance)
}
