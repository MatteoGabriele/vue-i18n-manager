import module from './store/module'
import { log } from './utils'

let instance

class StoreHandler {
  constructor (store) {
    if (!store) {
      log('You need to add the VuexStore instance in the plugin options', 'error')
      return
    }

    this.$store = store
  }

  /**
   * Register the current module to the application store
   * when the plugin is initliazed
   */
  register () {
    this.$store.registerModule('i18n', module)
  }
}

export default function (store) {
  if (!instance) {
    instance = new StoreHandler(store)
  }

  return instance
}
