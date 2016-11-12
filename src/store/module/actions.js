import find from 'lodash/find'
import axios from 'axios'
import { log } from '../../utils'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_STATE,
  SET_LANGUAGE,
  SET_TRANSLATION
} from './events'

export default {
  [REMOVE_LANGUAGE_PERSISTENCY]: ({ commit }) => {
    commit(REMOVE_LANGUAGE_PERSISTENCY)
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

  [SET_TRANSLATION]: async ({ commit, state }, code) => {
    const { path, availableLanguages, defaultCode } = state
    const language = find(availableLanguages, { code: code || defaultCode })

    if (!language) {
      log('The language doesn\'t exist. Is not possible to set a translation', 'warn')
      return
    }

    const url = `${path}/${language.translateTo}.json`

    try {
      const { data } = await axios.get(url)
      commit(SET_TRANSLATION, data)

      return data
    } catch (e) {
      let message = `${e.message} for ${url}`

      // Usually file path is wrong, but you never know boy!
      if (e.response.status === 404) {
        message = `Problems with the provided json file for translations. Check the url again`
      }

      log(message, 'warn')

      return
    }
  },

  [SET_LANGUAGE]: async ({ dispatch, commit, state }, code) => {
    const { currentLanguage } = state

    if (code && (currentLanguage && currentLanguage.code === code)) {
      return
    }

    commit(SET_LANGUAGE, code)

    return await dispatch(SET_TRANSLATION, code)
  }
}
