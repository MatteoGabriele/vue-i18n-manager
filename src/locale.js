import VueI18n from 'vue-i18n'

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
