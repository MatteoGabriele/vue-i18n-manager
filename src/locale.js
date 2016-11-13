/**
 * It updates vue-i18n plugin configurations
 * @param  {Vue instance} Vue
 * @param  {String} code
 * @param  {Object} translations
 */
export default function (Vue, code, translations) {
  Vue.locale(code, translations, () => {
    Vue.config.lang = code
  })
}
