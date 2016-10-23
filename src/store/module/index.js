import { mutations } from './mutations'
import state from './../../config'
import * as getters from './getters'
import actions from './actions'
console.log(state)
export default {
  state,
  mutations,
  getters,
  actions
}
