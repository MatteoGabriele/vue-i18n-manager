import {
  REMOVE_LANGUAGE_PERSISTENCY
} from './events'

export const mutations = {
  [REMOVE_LANGUAGE_PERSISTENCY] (state, payload) {
    state.persistent = false
  }
}
