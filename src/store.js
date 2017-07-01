import { proxies } from './proxy'

export default {
  state: {
    currentLanguage: {},
    translation: {},
    translations: {},
    forceTranslation: false,
    persistent: false,
    storageKey: 'i18n_key',
    defaultCode: null,
    languages: [],
    languageFilter: []
  },

  getters: {
    currentLanguage: state => state.currentLanguage,
    translation: state => {
      const { translation, translations, currentLanguage } = state
      const newTranslation = currentLanguage ? translations[currentLanguage.key] : {}

      return newTranslation || translation
    },
    availableLanguages: ({ languageFilter, languages }) => languages.filter(language => {
      return languageFilter.length > 0 ? languageFilter.indexOf(language.code) !== -1 : true
    }),
    defaultCode: (state, getters) => {
      const storagedLangCode = proxies.localStorage.getItem(state.storageKey)
      const languageList = state.forceTranslation ? state.languages : getters.availableLanguages
      const hasLocalstorage = state.persistent && storagedLangCode
      const exists = languageList.find(language => language.code === storagedLangCode)

      return (hasLocalstorage && exists) ? storagedLangCode : state.defaultCode
    },
    getLanguage: state => value => {
      return state.languages.find(({ code, key }) => {
        return code === value || key === value
      }) || state.currentLanguage
    }
  },

  actions: {
    changeSettings ({ commit, getters, dispatch }, { payload = {} }) {
      return Promise.resolve(payload).then(settings => {
        commit('changeSettings', settings)
        dispatch(setLanguage(getters.defaultCode))
      })
    },

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
    },

    setTranslation ({ commit, dispatch, state, getters }, { payload }) {
      const language = getters.getLanguage(payload)
      const { translations } = state
      const { getTranslation } = proxies

      if (!translations[language.key] && !getTranslation) {
        console.error(
          '[vue-i18n-manager] Please provide a translation object using the plugin configuration.'
        )
        throw new Error('No translation or proxy added')
      }

      if (translations[language.key]) {
        return
      }

      return getTranslation(language).then(response => {
        commit('setTranslation', {
          translation: response,
          key: language.key
        })
      })
    }
  },

  mutations: {
    /**
     * Change settings
     * @param  {Object} state
     * @param  {Object} settings new settings
     * @description updates all new parameters that are passed in the plugin registration.
     */
    changeSettings (state, settings) {
      const newState = Object.keys(state).reduce((result, key) => {
        const value = settings[key]
        return { ...result, [key]: typeof value !== 'undefined' ? value : state[key] }
      }, {})
      state = Object.assign(state, newState)
    },

    /**
     * Set language
     * @param {Object} state
     * @param {Object} language a language object
     * @description updates the current selected language and it saves the code in the
     * localStorage if it's possible.
     */
    setLanguage (state, language) {
      state.currentLanguage = language

      if (state.persistent) {
        proxies.localStorage.setItem(state.storageKey, language.code)
      }
    },

    /**
     * Set translation
     * @param {Object} state
     * @param {Object} translation new translation object
     * @param {String} key         language code related to the new translation
     * @description updates/creates a translation object inside the translations object
     * the current translation is also stored to be able to use it directly in the application
     * without using the locale functionalities
     */
    setTranslation (state, { translation, key }) {
      state.translation = translation
      state.translations = {
        ...state.translations,
        [key]: translation
      }
    }
  }
}

export const changePersistency = state => ({ type: 'removePersistency', payload: state })
export const changeSettings = settings => ({ type: 'changeSettings', payload: settings })
export const setLanguage = code => ({ type: 'setLanguage', payload: code })
export const setTranslation = code => ({ type: 'setTranslation', payload: code })
