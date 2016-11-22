import find from 'lodash/find'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import pick from 'lodash/pick'
import each from 'lodash/each'
import keys from 'lodash/keys'
import size from 'lodash/size'
import assignIn from 'lodash/assignIn'
import difference from 'lodash/difference'
import storageHelper from 'storage-helper'
import { systemState, deprecatedKeys } from './state'
import { warn } from '../../utils'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_STATE,
  SET_LANGUAGE,
  SET_TRANSLATION,
  SET_FORCE_TRANSLATION
} from './events'

/**
 * Warns if the default language code matches at least one of the provided languages,
 * otherwise the application could break.
 * @param  {Object} state
 */
const warnUnmatchedDefaultCode = (state) => {
  const langauge = find(state.availableLanguages, { code: state.defaultCode })

  if (langauge) {
    return
  }

  warn('The default code must matches at least one language in the provided list')
}

/**
 * Warns invalid or deprecated keys
 * @param  {Object} state
 * @param  {Object} newParams
 */
const warnInvalidKeys = (allowedKeys, paramsKeys) => {
  const invalidKeyes = difference(paramsKeys, allowedKeys)

  if (!invalidKeyes.length) {
    return
  }

  each(invalidKeyes, key => {
    const deprecated = find(deprecatedKeys, { old: key })

    if (deprecated) {
      warn(`"${key}" is a deprecated parameter. Please use "${deprecated.new}"`)
      return
    }

    warn(`"${key}" is not a valid parameter to pass in the config object`)
  })
}

const mutations = {
  [REMOVE_LANGUAGE_PERSISTENCY] (state) {
    state.persistent = false
  },

  [SET_FORCE_TRANSLATION] (state, payload) {
    state.forceTranslation = payload
  },

  [SET_TRANSLATION] (state, translations) {
    state.translations = translations
  },

  /**
   * To update the state is necessary to pass only existing keys, but also
   * only keys that are not related to the mutation state of the store module.
   * So in order to do that, it's necessary to remove all systemState keys from the
   * array of available keys
   * The filtered keys are compared with the plugin options keys and applied to the state.
   */
  [UPDATE_I18N_STATE] (state, newParams) {
    state.availableLanguages = newParams.languages || state.languages

    if (size(newParams) === 0) {
      return
    }

    const systemStateKeys = keys(systemState)
    const stateKeys = keys(state)
    const allowedKeys = difference(stateKeys, systemStateKeys)

    // Let's merge the new parameters with the state
    state = assignIn(state, pick(newParams, allowedKeys))

    if (state.languageFilter.length > 0) {
      state.availableLanguages = filter(state.availableLanguages, (language) => {
        return includes(state.languageFilter, language.code)
      })
    }

    warnUnmatchedDefaultCode(state)
    warnInvalidKeys(allowedKeys, keys(newParams))
  },

  [SET_LANGUAGE] (state, code) {
    const { persistent, storageKey, forceTranslation, languages, availableLanguages } = state
    const languageList = forceTranslation ? languages : availableLanguages
    const language = find(languageList, { code })

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
