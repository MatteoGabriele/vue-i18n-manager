/**
 * A private portion of the state
 * @type {Object}
 */
export const systemState = {
  currentLanguage: null,
  translation: {},
  translations: {},
  forceTranslation: false,
  availableLanguages: []
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
  defaultCode: 'en_GB',
  languageFilter: [],
  languages: [
    {
      name: 'English',
      code: 'en_GB',
      urlPrefix: 'en',
      translateTo: 'en_GB'
    }
  ]
}

/**
 * Deprecated keys holder
 * @type {Array}
 */
export const deprecatedKeys = [
  {
    old: 'availableLanguages',
    new: 'languageFilter'
  }
]

export default state
