import each from 'lodash/each'
import map from 'lodash/map'
import replace from 'lodash/replace'
import keys from 'lodash/keys'
import { log } from './utils'

let instance

class LocaleHandler {
  constructor (Vue, store) {
    this.$vue = Vue
    this.$store = store
  }

  interpolate (string, params) {
    if (!params) {
      return string
    }

    let originalString = string
    let propErrors = []

    const betweenCurlyBracesRegEx = new RegExp(/\{.*?}s?/g)
    const matchedParams = string.match(betweenCurlyBracesRegEx)
    const paramsKeys = keys(params)

    each(matchedParams, (match, i) => {
      const prop = match.slice(1, -1)
      const value = params[prop]
      const paramKey = paramsKeys[i]

      if (!value && paramKey) {
        propErrors.push(paramKey)
        return
      }

      string = replace(string, match, value)
    })

    /**
     * To better manage errors and typos, every errors will be logged in the console
     * with the current translated value
     */
    if (propErrors.length > 0) {
      propErrors = map(propErrors, error => `"${error}"`)

      log(`No match found for ${propErrors.join(', ')} in "${originalString}"`, 'warn')
    }

    return string
  }

  translate (label, params) {
    const { translations } = this.$store.getters

    if (!translations || !translations[label]) {
      return label
    }

    return this.interpolate(translations[label], params)
  }
}

export default function (Vue, store) {
  if (!instance) {
    instance = new LocaleHandler(Vue, store)
  }

  Vue.prototype.$t = instance.translate.bind(instance)

  return instance
}
