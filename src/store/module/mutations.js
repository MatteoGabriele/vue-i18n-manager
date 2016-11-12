import find from 'lodash/find'
import map from 'lodash/map'
import pick from 'lodash/pick'
import each from 'lodash/each'
import keys from 'lodash/keys'
import size from 'lodash/size'
import assignIn from 'lodash/assignIn'
import difference from 'lodash/difference'
import storageHelper from 'storage-helper'

import { systemState, deprecatedKeys } from './state'
import { log } from '../../utils'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_STATE,
  SET_LANGUAGE,
  SET_TRANSLATION
} from './events'

/**
 * Check if the default language code matches at least one of the provided languages,
 * otherwise the application could break.
 * @param  {Object} state
 */
const checkUnmatchedDefaultCode = (state) => {
  const langauge = find(state.availableLanguages, { code: state.defaultCode })

  if (langauge) {
    return
  }

  log('The default code must matches at least one language in the provided list', 'warn')
}

/**
 * Check invalid or deprecated keys
 * @param  {Object} state
 * @param  {Object} newParams
 */
const checkInvalidKeys = (state, params) => {
  const invalidKeyes = difference(keys(params), state)

  if (!invalidKeyes.length) {
    return
  }

  each(invalidKeyes, key => {
    const deprecated = find(deprecatedKeys, { old: key })

    if (deprecated) {
      log(`"${key}" is a deprecated parameter. Please use "${deprecated.new}"`, 'warn')
      return
    }

    log(`"${key}" is not a valid parameter to pass in the config object`, 'warn')
  })
}

const mutations = {
  [REMOVE_LANGUAGE_PERSISTENCY] (state) {
    state.persistent = false
  },

  [SET_TRANSLATION] (state, translations) {
    state.translations = translations
    state.error = false
    state.errorMessage = null
  },

  /**
   * To update the state is necessary to pass only existing keys, but also
   * only keys that are not related to the mutation state of the store module.
   * So in order to do that, it's necessary to create a brand new object that refers
   * to the actual state and than it needs to be filtered by the systemState keys, which are
   * all keys that the plugin itself can't mutate.
   * The filtered keys are compared with the plugin options keys and applied to the state.
   */
  [UPDATE_I18N_STATE] (state, newParams) {
    const systemStateKeys = keys(systemState)
    const availableStateKeys = keys({...state})
    const allowedKeys = difference(availableStateKeys, systemStateKeys)

    state.availableLanguages = newParams.languages || state.languages

    if (size(newParams) === 0) {
      return
    }

    // Let's merge the new parameters with the state
    state = assignIn(state, pick(newParams, allowedKeys))

    if (state.languageFilter.length > 0) {
      state.availableLanguages = map(state.languageFilter, (code) => {
        return find(state.availableLanguages, { code })
      })
    }

    checkUnmatchedDefaultCode(state)
    checkInvalidKeys(allowedKeys, newParams)
  },

  [SET_LANGUAGE] (state, code) {
    const { availableLanguages, persistent, storageKey } = state
    const language = find(availableLanguages, { code })

    if (!language) {
      return
    }

    if (persistent) {
      storageHelper.setItem(storageKey, language.code)
    }

    state.currentLanguage = language
  }
}

export default mutations
