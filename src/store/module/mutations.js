import find from 'lodash/find'
import filter from 'lodash/filter'
import includes from 'lodash/includes'
import pick from 'lodash/pick'
import keys from 'lodash/keys'
import assignIn from 'lodash/assignIn'
import storageHelper from 'storage-helper'

import { defineKeys, defineLanguages, defineUniqueLanguage } from '../../format'
import events from './events'

const mutations = {
  [events.REMOVE_LANGUAGE_PERSISTENCY] (state) {
    state.persistent = false
  },

  [events.SET_FORCE_TRANSLATION] (state, payload) {
    state.forceTranslation = payload
  },

  [events.SET_TRANSLATION] (state, { translation, code }) {
    const { translateTo, languages } = state.currentLanguage
    const language = find(languages, { code })

    /**
     * The index of the cached translation.
     * Normally we want the translation of the current langauge only,
     * but if we need to inject a new language which is not yet set
     * as the current one, we can still retrieve its translation
     * @type {String}
     */
    const index = language && language.translateTo || translateTo

    // It creates a new observable item in the array of translations
    state.translations = { ...state.translations, [index]: translation }

    // We need to cast the current translation just in case we can't retrieve
    // immediatly a new translation in the getters
    state.translation = translation
  },

  [events.ADD_TRANSLATION] (state, { translation, code }) {
    const { languages } = state
    const language = find(languages, { code })

    if (!language) {
      return
    }

    state.translations = { ...state.translations, [language.translateTo]: translation }
  },

  [events.UPDATE_CONFIGURATION] (state, newParams) {
    const newParamsKeys = keys(newParams)
    const stateKeys = keys(state)
    const newState = pick(newParams, stateKeys)

    state = assignIn(state, newState)
    state.availableLanguages = state.languages

    // Filter all languages
    if (state.languageFilter.length > 0 && state.availableLanguages.length > 1) {
      state.availableLanguages = filter(state.availableLanguages, (language) => {
        return includes(state.languageFilter, language.code)
      })
    }

    defineKeys(newParamsKeys, stateKeys, 'config')
    defineLanguages(state.availableLanguages, state.defaultCode)
  },

  [events.ADD_LANGUAGE] (state, language) {
    if (!defineUniqueLanguage(state.languages, language)) {
      return
    }
    state.languages.push(language)
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
