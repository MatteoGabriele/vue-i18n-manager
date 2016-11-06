import { UPDATE_I18N_STATE, CHANGE_LANGUAGE } from './store/module/events'
import { registerModule } from './store/module'

class I18n {
  constructor (Vue, { store, config }) {
    this._vue = Vue
    this._store = store
    this._config = config

    registerModule(this._store)
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
    const { defaultCode } = this._store.getters.defaultCode
    const newCode = code || defaultCode
    const translations = await this._store.dispatch(CHANGE_LANGUAGE, newCode)

    // Set vue-i18n locale configuration
    this._vue.locale(newCode, translations, () => {
      this._vue.config.lang = newCode
    })
  }

  /**
   * Initialize the plugin mutations
   */
  async init () {
    await this.updatePluginState()
    await this.setLanguage()
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
