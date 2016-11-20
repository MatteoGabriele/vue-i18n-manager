import find from 'lodash/find'
// import each from 'lodash/each'
import { log } from '../../utils'
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

  /**
   * This action will merge all parameter that are passed to the plugin with existing
   * parameter in the default state of the store.
   * No new parameters are allowed: they will simply be ignored.
   */
  [UPDATE_I18N_STATE]: async ({ commit, state }, payload) => {
    const params = (payload && payload.then) ? await payload : payload
    commit(UPDATE_I18N_STATE, params)
  },

  [SET_TRANSLATION]: async ({ commit, state, getters }, code) => {
    const { forceTranslation, availableLanguages, languages } = state
    const languageList = forceTranslation ? languages : availableLanguages
    const language = find(languageList, { code })

    if (!language) {
      log(`A language with code "${code}" doesn't exist`, 'warn')
      return
    }

    const requestURL = `${state.path}/${language.translateTo}.json`

    const request = new window.Request(requestURL, {
      method: 'GET',
      mode: 'cors',
      headers: new window.Headers({
        'Content-Type': 'application/json'
      })
    })

    const response = await window.fetch(request)

    if (!response.ok) {
      if (response.status === 404) {
        log('Translation error. Check if the file exists and the url is correct', 'warn')
        return
      }

      log(`${response.statusText} for ${requestURL}`, 'warn')

      return
    }

    const translation = await response.json()

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
