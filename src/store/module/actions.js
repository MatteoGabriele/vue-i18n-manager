import { warn } from '../../utils'
import proxy from '../../proxy'
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
    if (typeof config === 'function') {
      warn('Configuration must be an object or a promise')
      return
    }

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

  [events.UPDATE_TRANSLATION]: ({ commit }, payload) => {
    commit(events.UPDATE_TRANSLATION, payload)
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
    // the language can matches both url prefix and language code
    const exists = state.languages.find(n => n.code === code || n.urlPrefix === code)
    // always resolve with at least one language
    const lang = exists || state.currentLanguage

    // check if we are asking for the same language we already have as current
    if (state.currentLanguage && lang.code !== state.currentLanguage.code) {
      commit(events.SET_LANGUAGE, lang.code)
    }

    if (state.translations[lang.translationKey]) {
      return Promise.resolve()
    }

    // reject the promise and warn if there's no translation or a proxy to retrieve that
    if (!proxy.getTranslation) {
      const message = `Translation is missing for "${lang.code}"`

      warn(message)

      return Promise.reject(new Error(message))
    }

    // use the proxy to dynamically retrieve the translation
    return proxy.getTranslation(lang).then((response) =>
      dispatch(events.SET_TRANSLATION, {
        translation: response,
        code: lang.code
      })
    )
  }
}
