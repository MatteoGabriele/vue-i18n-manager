import mutations from './mutations'
import state from './state'
import * as getters from './getters'
import actions from './actions'

/**
 * Store module
 * @type {Object}
 */
const module = { state, mutations, getters, actions }

/**
 * Register the current module to the application store
 * when the plugin is initliazed
 * @param  {VuexStore} store
 */
export const registerModule = (store) => {
  store.registerModule('i18n', module)
}

export default module
