/**
 * Default store state
 * @type {Object}
 */
const state = {
  persistent: true,
  storageKey: 'language_key',
  languagePath: 'static/i18n',
  defaultCode: 'en',
  currentLanguage: null,
  pending: false,
  error: false,
  errorMessage: null,
  languages: [
    {
      name: 'English',
      code: 'en',
      urlPrefix: 'en',
      translateTo: 'en'
    },
    {
      name: 'Italiano',
      code: 'it',
      urlPrefix: 'it',
      translateTo: 'it'
    }
  ]
}

export default state
