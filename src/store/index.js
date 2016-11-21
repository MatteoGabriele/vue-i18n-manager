import module from './module'
import { warn } from '../utils'

export default function (store) {
  if (!store) {
    warn('You need to add the VuexStore instance in the plugin options')
    return
  }

  store.registerModule('i18n', module)
}
