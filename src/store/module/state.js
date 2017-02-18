/**
 * Default language
 * @type {Object}
 */
const defaultLanguage = {
  name: 'English',
  code: 'en_GB',
  urlPrefix: 'en',
  translationKey: 'en'
}

/**
 * Default translation
 * @type {Object}
 */
const defaultTranslation = {
  hello: 'hello!'
}

/**
 * Default store state
 * @type {Object}
 *
 */
const state = {
  currentLanguage: defaultLanguage,
  translation: defaultTranslation,
  translations: {
    [defaultLanguage.translationKey]: defaultTranslation
  },
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
