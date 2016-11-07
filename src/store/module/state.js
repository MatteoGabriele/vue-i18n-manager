/**
 * Default store state
 * @type {Object}
 */
const state = {
  persistent: true,
  currentLanguage: null,
  pending: false,
  error: false,
  errorMessage: null,
  translations: null,
  storageKey: 'language_key',
  path: 'static/i18n',
  defaultCode: 'en-GB',
  availableLanguages: [],
  languages: [
    {
      name: 'English',
      code: 'en-GB',
      urlPrefix: 'en',
      translateTo: 'en-GB'
    }
  ]
}

export default state
