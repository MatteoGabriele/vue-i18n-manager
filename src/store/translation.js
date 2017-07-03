import { proxies } from '../proxy'

export default {
  state: {
    translations: {},
    translation: {},
    forceTranslation: false
  },

  getters: {
    translation: (state, rootState) => {
      const { translation, translations } = state
      const { currentLanguage } = rootState
      const newTranslation = currentLanguage ? translations[currentLanguage.key] : {}

      return newTranslation || translation
    }
  },

  actions: {
    setTranslation ({ commit, dispatch, state, getters }, { payload }) {
      const language = getters.getLanguage(payload)
      const { translations } = state
      const { getTranslation } = proxies

      const translation = translations[language.key] || getTranslation(language)

      return Promise.resolve(translation).then(response => {
        commit('setTranslation', {
          translation: response,
          key: language.key
        })
      })
    }
  },

  mutations: {
    setTranslation (state, { translation, key }) {
      state.translation = translation
      state.translations = {
        ...state.translations,
        [key]: translation
      }
    }
  }
}

export const setTranslation = code => ({ type: 'setTranslation', payload: code })
