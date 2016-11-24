import module from './module'
import { warn, pluginName } from '../utils'

export default function (store) {
  if (!store) {
    warn('You need to add the VuexStore instance in the plugin options')
    return
  }

  store.registerModule(pluginName, module)
}

export const defineLanguage = (language) => {
  return language
}
