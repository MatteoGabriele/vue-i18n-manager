import find from 'lodash/find'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import pick from 'lodash/pick'
import keys from 'lodash/keys'
import size from 'lodash/size'
import assignIn from 'lodash/assignIn'
import difference from 'lodash/difference'
import storageHelper from 'storage-helper'

import { systemState } from './state'
import { defineKeys, defineLanguages } from '../../format'
import * as events from './events'

const mutations = {
  [events.REMOVE_LANGUAGE_PERSISTENCY] (state) {
    state.persistent = false
  },

  [events.SET_FORCE_TRANSLATION] (state, payload) {
    state.forceTranslation = payload
  },

  [events.SET_TRANSLATION] (state, translation) {
    const { translateTo } = state.currentLanguage

    state.translations = { ...state.translations, [translateTo]: translation }
    state.translation = translation
  },

  [events.UPDATE_I18N_CONFIG] (state, newParams) {
    const isNewStateDefined = size(newParams)

    if (!isNewStateDefined) {
      return
    }

    const newParamsKeys = keys(newParams)
    const systemStateKeys = keys(systemState)
    const stateKeys = keys(state)
    const allowedKeys = difference(stateKeys, systemStateKeys)
    const newState = pick(newParams, allowedKeys)

    state = assignIn(state, newState)
    state.availableLanguages = state.languages

    // Filter all languages
    if (state.languageFilter.length > 0 && state.availableLanguages.length > 1) {
      state.availableLanguages = filter(state.availableLanguages, (language) => {
        return includes(state.languageFilter, language.code)
      })
    }

    defineKeys(newParamsKeys, allowedKeys, 'config')
    defineLanguages(state.availableLanguages, state.defaultCode)
  },

  [events.ADD_LANGUAGE] (state, language) {

  },

  [events.SET_LANGUAGE] (state, code) {
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
