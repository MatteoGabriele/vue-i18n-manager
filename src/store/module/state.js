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
 * A private portion of the state
 * @type {Object}
 */
export const systemState = {
  currentLanguage: null,
  translation: {},
  translations: {},
  forceTranslation: false,
  availableLanguages: [
    defaultLanguage
  ]
}

/**
 * Default store state
 * @type {Object}
 *
 */
const state = {
  ...systemState,
  persistent: true,
  storageKey: 'language_key',
  path: 'static/i18n',
  defaultCode: defaultLanguage.code,
  languageFilter: [],
  languages: [
    defaultLanguage
  ]
}

export default state
