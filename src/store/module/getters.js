import storageHelper from 'storage-helper'
import find from 'lodash/find'

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

  translation: state => {
    const { translation, translations, currentLanguage } = state
    let newTranslation = translations[currentLanguage.translateTo]

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
    const {
      persistent,
      defaultCode,
      storageKey,
      forceTranslation,
      availableLanguages,
      languages
    } = state
    const storagedLangCode = storageHelper.getItem(storageKey)

    if (persistent && storagedLangCode) {
      const languageList = forceTranslation ? languages : availableLanguages

      /**
       * This part is actually checking if the language stored exists in the
       * current array of languages, otherwise it means that our localstorage value
       * is too old and we forgot to remove it from the browser memory.
       */
      const exists = find(languageList, { code: storagedLangCode })

      if (exists) {
        return storagedLangCode
      }
    }

    return defaultCode
  }
}
