import { UPDATE_I18N_STATE, CHANGE_LANGUAGE } from './store/module/events'
import { registerModule } from './store/module'

class I18n {
  _vue
  _config
  _store

  constructor (Vue, options) {
    const { store, config } = options

    this._options = options
    this._vue = Vue
    this._store = store
    this._config = config

    registerModule(this._store)
  }

  async updatePluginState () {
    await this._store.dispatch(UPDATE_I18N_STATE, this._config)
  }

  async setLanguage (code = null) {
    const translations = await this._store.dispatch(CHANGE_LANGUAGE, code)

    // Set vue-i18n locale configuration
    this._vue.locale(code, translations, () => {
      this._vue.config.lang = code
    })
  }

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
