import module from './module'
import { warn, pluginName } from '../utils'

/**
 * Module registration
 * @param {VuexStore} store
 */
export default function (store) {
  if (!store) {
    warn('You need to add the VuexStore instance in the plugin options')
    return
  }

  store.registerModule(pluginName, module)
}
