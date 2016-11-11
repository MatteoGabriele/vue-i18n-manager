import find from 'lodash/find'
import map from 'lodash/map'
import pick from 'lodash/pick'
import keys from 'lodash/keys'
import size from 'lodash/size'
import assignIn from 'lodash/assignIn'
import storageHelper from 'storage-helper'
import { log } from '../../utils'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_STATE,
  SET_LANGUAGE,
  SET_TRANSLATION
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

  [UPDATE_I18N_STATE] (state, params) {
    const availableKeys = keys(state)
    const newKeys = params

    state.availableLanguages = params.languages || state.languages

    if (size(newKeys) === 0) {
      return
    }

    const parsedParams = pick(newKeys, availableKeys)

    state = assignIn(state, parsedParams)

    if (state.languageFilter.length > 0) {
      state.availableLanguages = map(state.languageFilter, (code) => {
        return find(state.availableLanguages, { code })
      })
    }

    // Check if the default language code matches at least one of the provided languages,
    // otherwise the application could break.
    const match = find(state.availableLanguages, { code: state.defaultCode })

    if (!match) {
      const message = 'The default code must matches at least one language in the provided list'

      state.errorMessage = message
      state.error = true

      log(message, 'error')
    }
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
