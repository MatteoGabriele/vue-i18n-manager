import { setItem, getItem, removeItem } from 'storage-helper'
import _ from 'lodash'
import axios from 'axios'

/**
 * The current Vue instance reference
 */
let $vue

/**
 * Default configuration Object
 * @type {Object}
 */
let i18nState = {
  persistent: true,
  storageKey: 'language_key',
  languagePath: 'static/i18n',
  defaultCode: 'en',
  hasStore: false,
  hasRouter: false,
  translations: null,
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

/**
 * To be able to use a Vue plugin we need to expose an install
 * method that Vue needs to integrate the plugin inside the life cycle
 * of the application.
 * The install methods has two parameters: the Vuew instance
 * and options object with allows to pass some default parameters
 */
const install = (Vue, options = {}) => {
  $vue = Vue
  initI18nManager(options)
}

/**
 * Returns the current language of the application
 * based on user previous choice or default application code
 * @return {String} [description]
 */
const getLanguageCode = () => {
  const { persistent, defaultCode, storageKey } = i18nState
  const storagedLanguageCode = getItem(storageKey)

  if (persistent && storagedLanguageCode) {
    return storagedLanguageCode
  }

  return defaultCode
}

const translateBy = async (language) => {
  const { persistent, storageKey, hasStore, languagePath } = i18nState
  const { translateTo, code } = language

  if (hasStore) {
    return
  }

  const { data } = await axios.get(`${languagePath}/${translateTo}.json`)

  if (persistent) {
    setItem(storageKey, code)
  }

  $vue.locale(code, data, () => {
    $vue.config.lang = code
  })

  return data
}

/**
 * Returns a configuration file that can be customized during
 * installation
 * @param  {Object|Promise}  config
 * @return {Promise}
 */
const getConfigurations = async (config) => {
  let newConfig = (config && config.then) ? await config : config
  return _.assignIn(i18nState, newConfig)
}

const initI18nManager = async ({ store, router, config }) => {
  i18nState = await getConfigurations(config)

  const { persistent, storageKey, languages } = i18nState

  if (!persistent) {
    removeItem(storageKey)
  }

  const code = getLanguageCode()

  /**
   * Nothing to fancy here, just need override defaults of vue-i18n
   */
  $vue.config.lang = code
  $vue.config.fallback = code

  const language = _.find(languages, { code })
  await translateBy(language)
}

export default { install }
