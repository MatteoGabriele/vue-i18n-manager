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

  [events.UPDATE_CONFIGURATION]: ({ commit, state, getters }, config = {}) => {
    if (config && config.then) {
      return config.then(params => {
        commit(events.UPDATE_CONFIGURATION, params)

        // When we wait for the configuration to load asynchronously
        // we need to mutate the default language because the application
        // could be already mounted with a default language that is not
        // the one in the configuration
        commit(events.SET_LANGUAGE, getters.defaultCode)
      })
    }

    commit(events.UPDATE_CONFIGURATION, config)
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

  [events.SET_LANGUAGE]: ({ dispatch, commit, state }, code) => {
    const exists = state.languages.find(n => n.code === code)
    const languageCode = exists ? code : state.defaultCode

    if (state.currentLanguage.code === code) {
      return
    }

    commit(events.SET_LANGUAGE, languageCode)
  }
}
