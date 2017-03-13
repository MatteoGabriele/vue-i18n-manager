/**
 * Default language
 * @type {Object}
 */
const defaultLanguage = {
  name: 'English',
  code: 'en-GB',
  urlPrefix: 'en',
  translationKey: 'en'
}

/**
 * Default store state
 * @type {Object}
 *
 */
const state = {
  currentLanguage: defaultLanguage,
  translation: {},
  translations: {},
  forceTranslation: false,
  persistent: false,
  storageKey: 'language_key',
  defaultCode: defaultLanguage.code,
  availableLanguages: [defaultLanguage],
  languages: [defaultLanguage],
  languageFilter: []
}

export default state
