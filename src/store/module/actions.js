import find from 'lodash/find'
import { getTranslation } from '../../proxy/translation'
import { warn } from '../../utils'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_STATE,
  SET_LANGUAGE,
  SET_TRANSLATION,
  SET_FORCE_TRANSLATION
} from './events'

export default {
  [REMOVE_LANGUAGE_PERSISTENCY]: ({ commit }) => {
    commit(REMOVE_LANGUAGE_PERSISTENCY)
  },

  [SET_FORCE_TRANSLATION]: ({ commit }, payload) => {
    commit(SET_FORCE_TRANSLATION, payload)
  },

  [UPDATE_I18N_STATE]: async ({ commit, state }, payload = {}) => {
    const params = (payload && payload.then) ? await payload : payload
    commit(UPDATE_I18N_STATE, params)
  },

  [SET_TRANSLATION]: async ({ commit, state, getters }, code) => {
    const { forceTranslation, availableLanguages, languages } = state
    const languageList = forceTranslation ? languages : availableLanguages
    const language = find(languageList, { code })

    if (!language) {
      warn(`A language with code "${code}" doesn't exist or it's filtered`)
      return
    }

    const translation = await getTranslation(state, language)

    commit(SET_TRANSLATION, translation)

    return translation
  },

  [SET_LANGUAGE]: async ({ dispatch, commit, state }, code) => {
    const { currentLanguage } = state

    if (code && (currentLanguage && currentLanguage.code === code)) {
      return
    }

    commit(SET_LANGUAGE, code)

    return dispatch(SET_TRANSLATION, code)
  }
}
