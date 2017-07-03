import { setTranslation } from './translation'
import { proxies } from '../proxy'

export default {
  state: {
    defaultCode: null,
    currentLanguage: null,
    languages: [],
    languageFilter: []
  },

  getters: {
    currentLanguage: state => state.currentLanguage,

    availableLanguages: ({ languageFilter, languages }) => {
      return languages.filter(language => {
        return languageFilter.length > 0
          ? languageFilter.indexOf(language.code) !== -1
          : true
      })
    },

    defaultCode: (state, getters, rootState, rootGetters) => {
      const { languages, defaultCode, persistent } = state
      const { forceTranslation, storageKey } = rootState
      const { availableLanguages } = rootGetters

      // we need to check if the we are using the translation-tool that allows us
      // to watch all languages no matter the settings
      const languageList = forceTranslation ? languages : availableLanguages

      const storagedLangCode = proxies.localStorage.getItem(storageKey)
      const hasLocalstorage = persistent && storagedLangCode
      const exists = languageList.find(language => language.code === storagedLangCode)

      return (hasLocalstorage && exists) ? storagedLangCode : defaultCode
    },

    getLanguage: state => value => {
      return state.languages.find(({ code, key }) => {
        return code === value || key === value
      }) || state.currentLanguage
    }
  },

  actions: {
    setLanguage ({ commit, dispatch, state, getters }, { payload }) {
      const { currentLanguage } = state
      const language = getters.getLanguage(payload)

      if (currentLanguage && language.code === currentLanguage.code) {
        return Promise.resolve({ language, status: 'unchanged' })
      }

      commit('setLanguage', language)

      return dispatch(setTranslation(language.code)).then(() => {
        return { language, status: 'changed' }
      })
    }
  },

  mutations: {
    setLanguage (state, language) {
      state.currentLanguage = language
    }
  }
}

export const setLanguage = code => ({ type: 'setLanguage', payload: code })
