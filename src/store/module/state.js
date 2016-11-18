export const systemState = {
  currentLanguage: null,
  pending: false,
  error: false,
  errorMessage: null,
  translations: null,
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
  defaultCode: 'en-GB',
  languageFilter: [],
  languages: [
    {
      name: 'English',
      code: 'en-GB',
      urlPrefix: 'en',
      translateTo: 'en-GB'
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
