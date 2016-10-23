/**
 * Default configuration Object
 * @type {Object}
 */
export default {
  name: 'i18n',
  persistent: true,
  storageKey: 'language_key',
  languagePath: 'static/i18n',
  defaultCode: 'en',
  hasStore: false,
  hasRouter: false,
  language: null,
  pending: false,
  error: false,
  errorMessage: null,
  languages: [
    {
      name: 'English',
      code: 'en',
      urlPrefix: 'en',
      translateTo: 'en'
    }
  ]
}
