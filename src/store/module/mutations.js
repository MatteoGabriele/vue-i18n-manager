import find from 'lodash/find'
import assignIn from 'lodash/assignIn'
import storageHelper from 'storage-helper'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_STATE,
  CHANGE_LANGUAGE,
  SET_TRANSLATION
} from './events'

const mutations = {
  [REMOVE_LANGUAGE_PERSISTENCY] (state) {
    state.persistent = false
  },
  [SET_TRANSLATION] (state, translations) {
    state.translations = translations
  },
  [UPDATE_I18N_STATE] (state, newState) {
    state = assignIn(state, newState)
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
