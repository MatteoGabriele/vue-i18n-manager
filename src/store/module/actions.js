import find from 'lodash/find'
import { getTranslation } from '../../proxy/translation'
import { warn } from '../../utils'
import { defineLanguage } from '../../format'
import events from './events'

export default {
  /**
   * Removes the possibility to save data in the browser
   */
  [events.REMOVE_LANGUAGE_PERSISTENCY]: ({ commit }) => {
    commit(events.REMOVE_LANGUAGE_PERSISTENCY)
  },

  /**
   * Enables the force translation mode, which allows us to view all languages
   * without any filter.
   */
  [events.SET_FORCE_TRANSLATION]: ({ commit }, payload) => {
    commit(events.SET_FORCE_TRANSLATION, payload)
  },

  [events.UPDATE_CONFIGURATION]: async ({ commit, state }, config = {}) => {
    const params = (config && config.then) ? await config : config
    commit(events.UPDATE_CONFIGURATION, params)
  },

  /**
   * It takes a language code as payload, which will then matches with one of the listed languages.
   * Then language object will be passed to the proxy which will retrieve a translation object.
   * If the translation already exists in our "translations" array, the proxy is skipped and
   * we dispatch the translation directly.
   */
  [events.GET_TRANSLATION]: async ({ dispatch, commit, state }, code) => {
    const { forceTranslation, availableLanguages, languages, currentLanguage, translations } = state
    const languageList = forceTranslation ? languages : availableLanguages
    const language = find(languageList, { code })
    const cached = translations[currentLanguage.translateTo]

    if (!language) {
      warn(`A language with code "${code}" doesn't exist or it's filtered`)
      return
    }

    if (cached) {
      return cached
    }

    const translation = await getTranslation(state, language)
    dispatch(events.SET_TRANSLATION, { translation, code })

    return translation
  },

  [events.SET_TRANSLATION]: ({ commit }, payload) => {
    commit(events.SET_TRANSLATION, payload)
  },

  [events.ADD_TRANSLATION]: ({ commit }, payload) => {
    commit(events.ADD_TRANSLATION, payload)
  },

  [events.ADD_LANGUAGE]: ({ dispatch, commit }, language) => {
    if (!defineLanguage(language)) {
      return
    }

    commit(events.ADD_LANGUAGE, language)
  },

  [events.SET_LANGUAGE]: async ({ dispatch, commit, state }, code) => {
    if (!code) {
      return
    }

    commit(events.SET_LANGUAGE, code)

    return dispatch(events.GET_TRANSLATION, code)
  }
}
