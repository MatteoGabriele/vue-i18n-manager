/**
 * Default language of the store
 * @type {Object}
 */
const defaultLanguage = {
  name: 'English',
  code: 'en_GB',
  urlPrefix: 'en',
  translateTo: 'en_GB'
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
  persistent: true,
  storageKey: 'language_key',
  path: 'static/i18n',
  defaultCode: defaultLanguage.code,
  availableLanguages: [defaultLanguage],
  languages: [defaultLanguage],
  languageFilter: [],
  trustURL: false
}

export default state
