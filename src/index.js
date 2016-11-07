import find from 'lodash/find'
import { UPDATE_I18N_STATE, CHANGE_LANGUAGE } from './store/module/events'
import module from './store/module'
import { log } from './utils'

class I18n {
  constructor (Vue, { store, router, config }) {
    if (!store) {
      log('You need to add the Vuex store in the plugin options.', 'error')
      return
    }

    this._vue = Vue
    this._store = store
    this._config = config
    this._router = router
  }

  registerRouter () {
    if (!this._router) {
      return
    }

    this._router.beforeEach((to, from, next) => {
      const { languages, currentLanguage, defaultCode } = this._store.getters
      const urlCode = to.params.lang
      const urlLanguage = find(languages, { urlPrefix: urlCode })

      /**
       * In case of a failed call to an not existing json file,
       * the store will pushing the default language as a fallback.
       * Here we just redirect the browser to the current page
       * and inject the current url prefix.
       */
      if (!urlLanguage && !from.name) {
        const { urlPrefix } = find(languages, { code: defaultCode })

        return next({
          name: to.name,
          params: { lang: urlPrefix }
        })
      }

      /**
       * Check if the detected language in the URL is also the current
       * translated language, otherwise it needs to be updated.
       * Browser language has prioriry over the store state.
       * Next method or vue-router needs to be called after the translation
       * has been retrieved or there's a chance that the application
       * is not entirely affected.
       */
      if (urlLanguage && urlLanguage.urlPrefix !== currentLanguage.urlPrefix) {
        this.setLanguage(urlLanguage.code).then(() => next())
        return
      }

      next()
    })
  }

  /**
   * Register the current module to the application store
   * when the plugin is initliazed
   */
  registerModule () {
    this._store.registerModule('i18n', module)
  }

  /**
   * Update plugin state.
   * Updates the module default state merging it with the plugin config options
   */
  async updatePluginState () {
    await this._store.dispatch(UPDATE_I18N_STATE, this._config)
  }

  /**
   * Set language
   * It sets the new requested language and returns the translations
   * which are then applyed via vue-i18n.
   * If no language is passed, the language will be the one choosen as default
   * @type {String}
   */
  async setLanguage (code = null) {
    const { defaultCode } = this._store.getters
    const newCode = code || defaultCode
    const translations = await this._store.dispatch(CHANGE_LANGUAGE, newCode)

    /**
     * If the route is defined we also going to replace the current language
     * in the url with the new selected
     */
    if (this._router && this._router.currentRoute) {
      const { currentRoute } = this._router
      const { urlPrefix } = this._store.getters.currentLanguage

      this._router.replace({
        name: currentRoute.name,
        params: {
          lang: urlPrefix
        }
      })
    }

    // Set vue-i18n locale configuration
    this._vue.locale(newCode, translations, () => {
      this._vue.config.lang = newCode
    })
  }

  /**
   * Initialize the plugin mutations
   */
  async init () {
    // Register the i18n module to the application store
    this.registerModule()

    // Merge configuration from the plugin options with the module default state
    await this.updatePluginState()

    // Set the current language and translations
    await this.setLanguage()

    // Start managing routes
    this.registerRouter()
  }
}

/**
 * Expose the install function to let Vue install the plugin
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
export default function install (Vue, options = {}) {
  const I18nInstance = new I18n(Vue, options)

  Vue.$i18n = I18nInstance
  Vue.prototype.$i18n = I18nInstance
}
