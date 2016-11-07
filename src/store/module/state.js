/**
 * Default store state
 * @type {Object}
 */
const state = {
  persistent: true,
  storageKey: 'language_key',
  path: 'static/i18n',
  defaultCode: 'en-GB',
  currentLanguage: null,
  initialized: false,
  pending: false,
  error: false,
  errorMessage: null,
  translations: null,
  languages: [
    {
      name: 'English',
      code: 'en-GB',
      urlPrefix: 'en',
      translateTo: 'en-GB'
    },
    {
      name: 'Italiano',
      code: 'it-IT',
      urlPrefix: 'it',
      translateTo: 'it-IT'
    }
  ]
}

export default state
