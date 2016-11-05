import {
  INIT_I18N_STATE,
  CHANGE_LANGUAGE
} from './store/module/events'
import { dispatch, initializeStore } from './store'

class I18n {
  _options
  _vue

  constructor (Vue, options) {
    const { store, config } = options
    this._options = options
    this._vue = Vue

    initializeStore(store)

    dispatch(INIT_I18N_STATE, config)
  }

  init = async () => {

  }
}

const changeLanguage = async (code) => {
  dispatch(CHANGE_LANGUAGE, code)
}

/**
 * Expose the install function to let Vue install the plugin
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
export default function install (Vue, options = {}) {
  Vue.$i18n = new I18n(Vue, options)
  Vue.prototype.$i18n = { changeLanguage }
}
