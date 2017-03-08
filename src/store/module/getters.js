import proxy from '../../proxy'

export default {
  /**
   * All available languages with filters
   * @param  {Object} state
   * @return {Array<Object>}
   */
  availableLanguages: state => state.availableLanguages,

  /**
   * All languages without filters
   * @param  {Object} state
   * @return {Array<Object>}
   */
  languages: state => state.languages,

  /**
   * The current language
   * @param  {Object} state
   * @return {Object]}
   */
  currentLanguage: state => state.currentLanguage,

  /**
   * The URL prefix of the current language
   * @param  {Object} state
   * @return {String}
   */
  urlPrefix: state => state.currentLanguage.urlPrefix,

  /**
   * All filters applied to the availableLanguages Array
   * @param  {Object} state
   * @return {Array<String>}
   */
  languageFilter: state => state.languageFilter,

  /**
   * Current language translation
   * @param  {Object} state
   * @return {Object}
   */
  translation: state => {
    const { translation, translations, currentLanguage } = state

    if (!currentLanguage) {
      return {}
    }

    const newTranslation = translations[currentLanguage.translationKey]

    if (!newTranslation) {
      return translation
    }

    return newTranslation
  },

  /**
   * Forced translation status.
   * This check is used to show all languages without any filters
   * from the Translation Tool component
   * @param  {Object} state
   * @return {Boolean}
   */
  forceTranslation: state => state.forceTranslation,

  /**
   * The default language code of the application
   * @param  {Object} state
   * @return {String}
   */
  defaultCode: state => {
    const storagedLangCode = proxy.localStorage.getItem(state.storageKey)
    const languageList = state.forceTranslation ? state.languages : state.availableLanguages
    const hasLocalstorage = state.persistent && storagedLangCode
    const exists = languageList.find(n => n.code === storagedLangCode)

    return (hasLocalstorage && exists) ? storagedLangCode : state.defaultCode
  }
}
