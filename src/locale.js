import VueI18n from 'vue-i18n'
import { log } from './utils'

let instance

class LocaleHandler {
  constructor (Vue) {
    this.$vue = Vue

    this.installVueI18n()
  }

  installVueI18n () {
    if (this.$vue.config.lang) {
      return
    }

    this.$vue.use(VueI18n)
  }

  /**
   * It updates vue-i18n plugin configurations
   * @param  {Vue instance} Vue
   * @param  {String} code
   * @param  {Object} translations
   */
  update (code, translations) {
    if (!this.$vue.config.lang) {
      log('You need to install vue-i18n plugin https://www.npmjs.com/package/vue-i18n', 'warn')
      // if vue-i18n plugin is not installed, then function
      // will prevent the app to throw an error
      this.$vue.prototype.$t = (label, a) => {
        return label
      }
      return
    }

    this.$vue.locale(code, translations, () => {
      this.$vue.config.lang = code
    })
  }
}

export default function (Vue) {
  if (!instance) {
    instance = new LocaleHandler(Vue)
  }

  return instance
}
