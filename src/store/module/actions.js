import find from 'lodash/find'
import { getTranslation } from '../../proxy/translation'
import { warn } from '../../utils'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_CONFIG,
  SET_LANGUAGE,
  SET_TRANSLATION,
  GET_TRANSLATION,
  SET_FORCE_TRANSLATION
} from './events'

export default {
  [REMOVE_LANGUAGE_PERSISTENCY]: ({ commit }) => {
    commit(REMOVE_LANGUAGE_PERSISTENCY)
  },

  [SET_FORCE_TRANSLATION]: ({ commit }, payload) => {
    commit(SET_FORCE_TRANSLATION, payload)
  },

  [UPDATE_I18N_CONFIG]: async ({ commit, state }, config = {}) => {
    const params = (config && config.then) ? await config : config
    commit(UPDATE_I18N_CONFIG, params)
  },

  [GET_TRANSLATION]: async ({ dispatch, commit, state }, code) => {
    const {
      forceTranslation,
      availableLanguages,
      languages,
      currentLanguage,
      translations
    } = state
    const languageList = forceTranslation ? languages : availableLanguages
    const language = find(languageList, { code })
    const { id } = currentLanguage
    const cached = translations[id]

    if (!language) {
      warn(`A language with code "${code}" doesn't exist or it's filtered`)
      return
    }

    if (cached) {
      return cached
    }

    const translation = await getTranslation(state, language)

    dispatch(SET_TRANSLATION, translation)

    return translation
  },

  [SET_TRANSLATION]: ({ commit }, translation) => {
    commit(SET_TRANSLATION, translation)
    return translation
  },

  [SET_LANGUAGE]: async ({ dispatch, commit, state }, code) => {
    const { currentLanguage } = state

    if (code && (currentLanguage && currentLanguage.code === code)) {
      return
    }

    commit(SET_LANGUAGE, code)

    return dispatch(GET_TRANSLATION, code)
  }
}
