import find from 'lodash/find'
import map from 'lodash/map'
import assignIn from 'lodash/assignIn'
import storageHelper from 'storage-helper'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_STATE,
  CHANGE_LANGUAGE,
  SET_TRANSLATION,
  SET_TRANSLATION_ERROR
} from './events'

const mutations = {
  [REMOVE_LANGUAGE_PERSISTENCY] (state) {
    state.persistent = false
  },

  [SET_TRANSLATION] (state, translations) {
    state.translations = translations
    state.error = false
    state.errorMessage = null
  },

  [SET_TRANSLATION_ERROR] (state, errorMessage) {
    state.errorMessage = errorMessage
    state.error = true
  },

  [UPDATE_I18N_STATE] (state, newState) {
    state = assignIn(state, newState)

    if (state.availableLanguages.length) {
      state.languages = map(state.availableLanguages, (code) => {
        return find(state.languages, { code })
      })
    }
  },

  [CHANGE_LANGUAGE] (state, code) {
    const { languages, persistent, storageKey } = state
    const language = find(languages, { code })

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
