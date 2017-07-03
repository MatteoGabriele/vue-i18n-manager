import language, { setLanguage } from './language'
import translation from './translation'
import { applyIfDef } from '../utils'

export default {
  state: {
    persistent: false,
    storageKey: 'i18n_key'
  },

  actions: {
    changeSettings ({ commit, dispatch, rootGetters }, { payload = {} }) {
      return Promise.resolve(payload).then(settings => {
        commit('changeSettings', settings)
        dispatch(setLanguage(rootGetters.defaultCode))
      })
    }
  },

  mutations: {
    changeSettings (state, settings) {
      const { defaultCode, languages, languageFilter } = state.language
      const { translations } = state.translation

      state.language.defaultCode = applyIfDef(settings.defaultCode, defaultCode)
      state.language.languages = applyIfDef(settings.languages, languages)
      state.language.languageFilter = applyIfDef(settings.languageFilter, languageFilter)
      state.translation.translations = applyIfDef(settings.translations, translations)
    }
  },

  modules: {
    language,
    translation
  }
}

export const changeSettings = settings => ({ type: 'changeSettings', payload: settings })
