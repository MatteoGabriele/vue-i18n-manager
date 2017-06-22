import proxy from '../../proxy'

const defaultLanguage = {
  name: 'English',
  code: 'en-GB',
  urlPrefix: 'en',
  translationKey: 'en'
}

export default {
  state: {
    currentLanguage: defaultLanguage,
    translation: {},
    translations: {},
    forceTranslation: false,
    persistent: false,
    storageKey: 'i18n_key',
    defaultCode: defaultLanguage.code,
    languages: [defaultLanguage],
    languageFilter: []
  },

  getters: {
    currentLanguage: state => state.currentLanguage,
    translation: state => state.translation,
    availableLanguages: ({ languageFilter, languages }) => languages.filter(language => {
      return languageFilter.length > 0 ? languageFilter.indexOf(language.code) !== -1 : true
    }),
    defaultCode: (state, getters) => {
      const storagedLangCode = proxy.localStorage.getItem(state.storageKey)
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
        dispatch('setLanguage', getters.defaultCode)
      })
    },

    setLanguage ({ commit, dispatch, state, getters }, { payload }) {
      const { translations, languages, currentLanguage } = state
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
      const { getTranslation } = proxy
      const translation = getTranslation ? getTranslation(language) : translations[language.key]

      return Promise.resolve(translation).then(response => {
        commit('setTranslation', {
          translation: response,
          key: language.key
        })
      })
    }
  },

  mutations: {
    changeSettings (state, settings) {
      const newState = Object.keys(state).reduce((result, key) => {
        const value = settings[key]
        return { ...result, [key]: typeof value !== 'undefined' ? value : state[key] }
      }, {})
      state = Object.assign(state, newState)
    },

    setLanguage (state, language) {
      state.currentLanguage = language

      if (state.persistent) {
        proxy.localStorage.setItem(state.storageKey, language.code)
      }
    },

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
