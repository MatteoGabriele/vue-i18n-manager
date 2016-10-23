import { setItem, getItem, removeItem } from 'storage-helper'
import _ from 'lodash'
import axios from 'axios'

import state from './config'
import storeManager, { dispatch } from './store/storeManager'

/**
 * The current Vue instance reference
 */
let _vue

/**
 * Installation options
 */
let _options

/**
 * i18n state
 */
let _state

/**
 * To be able to use a Vue plugin we need to expose an install
 * method that Vue needs to integrate the plugin inside the life cycle
 * of the application.
 * The install methods has two parameters: the Vuew instance
 * and options object with allows to pass some default parameters
 */
const install = (Vue, options = {}) => {
  _vue = Vue
  _options = options

  _vue.initI18nManager = initI18nManager
}

/**
 * Returns the current language of the application
 * based on user previous choice or default application code
 * @return {String} [description]
 */
const getLanguageCode = () => {
  const { persistent, defaultCode, storageKey } = _state
  const storagedLanguageCode = getItem(storageKey)

  if (persistent && storagedLanguageCode) {
    return storagedLanguageCode
  }

  return defaultCode
}

const translateBy = async (language) => {
  const { translateTo, code } = language
  const { persistent, storageKey, hasStore, languagePath } = _state

  if (hasStore) {
    return
  }

  const { data } = await axios.get(`${languagePath}/${translateTo}.json`)

  if (persistent) {
    setItem(storageKey, code)
  }

  _vue.locale(code, data, () => {
    _vue.config.lang = code
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

  /**
   * @todo
   * don't change the state object.
   * not even know how can be changed if it's in readonly
   * but try to dispatch every kind of event to keep track
   * of every mutation
   */
  return _.assignIn({ ...state }, newConfig)
}

const initI18nManager = async () => {
  /**
   * Update the default state with new changes
   */
  _state = await getConfigurations(_options.config)

  const { persistent, storageKey, languages } = _state

  if (!persistent) {
    removeItem(storageKey)
  }

  const code = getLanguageCode()

  /**
   * Nothing to fancy here, just need override defaults of vue-i18n
   */
  _vue.config.lang = code
  _vue.config.fallback = code

  const language = _.find(languages, { code })
  const translations = await translateBy(language)

  return { translations, language }
}

export default { install }
