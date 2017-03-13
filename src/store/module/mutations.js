import proxy from '../../proxy'
import { warn } from '../../utils'
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
    const { languages } = state
    const { translationKey } = state.currentLanguage
    const language = languages.find(n => n.code === code)

    /**
     * The index of the translation we want to inject or update.
     * If the language doesn't exist, it falls back to the current language
     * @type {String}
     */
    const index = language && (language.translationKey || translationKey)

    state.translations = {
      ...state.translations,
      [index]: translation
    }

    // We need to cast the current translation just in case we can't retrieve
    // immediatly a new translation in the getters
    state.translation = translation
  },

  [events.ADD_TRANSLATION] (state, { translation, code }) {
    const { languages } = state
    const language = languages.find(n => n.code === code)

    if (!language) {
      return
    }

    state.translations = {
      ...state.translations,
      [language.translationKey]: translation
    }
  },

  [events.UPDATE_TRANSLATION] (state, { keys, code }) {
    const { languages } = state
    const language = languages.find(n => n.code === code)

    if (!language) {
      warn(`Language with "${code}" as code doesn't exist`)
      return
    }

    const newTranslation = Object.assign(state.translations[language.translationKey], keys)

    state.translations = {
      ...state.translations,
      [language.translationKey]: newTranslation
    }
  },

  [events.UPDATE_CONFIGURATION] (state, newParams) {
    const newParamsKeys = Object.keys(newParams)
    const stateKeys = Object.keys(state)

    // Only the properties in the store module are taken
    let newState = {}

    stateKeys.forEach(key => {
      if (typeof newParams[key] === 'undefined') {
        return
      }

      newState[key] = newParams[key]
    })

    state = Object.assign(state, newState)
    state.availableLanguages = state.languages

    // Filter all languages
    if (state.languageFilter.length > 0 && state.availableLanguages.length > 1) {
      state.availableLanguages = state.availableLanguages.filter(language => {
        return state.languageFilter.indexOf(language.code) !== -1
      })
    }

    defineKeys(newParamsKeys, stateKeys, 'config', ['path', 'trustURL'])
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
    const language = languageList.find(n => n.code === code)

    if (!language) {
      return
    }

    if (persistent) {
      proxy.localStorage.setItem(storageKey, language.code)
    }

    state.currentLanguage = language
  }
}

export default mutations
