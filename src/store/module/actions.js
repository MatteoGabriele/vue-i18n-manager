import {
  REMOVE_LANGUAGE_PERSISTENCY,
  INIT_I18N_STATE,
  CHANGE_LANGUAGE
} from './events'

export default {
  [REMOVE_LANGUAGE_PERSISTENCY]: ({ commit }) => {
    commit(REMOVE_LANGUAGE_PERSISTENCY)
  },
  [INIT_I18N_STATE]: async ({ commit }, payload) => {
    const newState = (payload && payload.then) ? await payload : payload
    commit(INIT_I18N_STATE, newState)
  },
  [CHANGE_LANGUAGE]: ({ commit, state }, payload) => {
    const { currentLanguage } = state

    if (currentLanguage.code === payload) {
      return
    }

    commit(CHANGE_LANGUAGE, payload)
  }
}
