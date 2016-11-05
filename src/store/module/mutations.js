import _ from 'lodash'
import storageHelper from 'storage-helper'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  INIT_I18N_STATE,
  CHANGE_LANGUAGE
} from './events'

/**
 * Update the value of the currentLanguage in the state
 */
const changeLanguage = (state, payload) => {
  const { languages, persistent, storageKey } = state
  const language = _.find(languages, { code: payload })

  if (!language) {
    return
  }

  if (persistent) {
    storageHelper.setItem(storageKey, language.code)
  }

  state.currentLanguage = language
}

const mutations = {
  /**
   * It removes the persistency of the language in the browser memory
   */
  [REMOVE_LANGUAGE_PERSISTENCY] (state, payload) {
    state.persistent = false
  },

  /**
   * Extends the current store state.
   * If there's no match with existing keys in the default state,
   * the current unchanged state is returned.
   * Only existing keys are merged.
   *
   * @todo: check language persistency and how to add that to the initial state tree
   */
  [INIT_I18N_STATE] (state, payload) {
    const availableKeys = _.keys(state)
    const newKeys = payload
    const newState = _.pick(newKeys, availableKeys)

    if (_.size(newKeys) === 0) {
      return state
    }

    state = _.assignIn(state, newState)
    changeLanguage(state, state.defaultCode)
  },
  [CHANGE_LANGUAGE] (state, payload) {
    changeLanguage(state, payload)
  }
}

export default mutations
