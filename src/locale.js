import events from './store/module/events'
import { updateURLPrefix } from './router'
import { warn } from './utils'

/**
 * To better manage errors and typos, every errors will be logged in the console
 * with the current translated value
 */
function warnPropertyError (errors, context) {
  if (errors.length > 0) {
    errors = errors.map(error => `"${error}"`)

    warn(`No match found for ${errors.join(', ')} in "${context}"`)
  }
}

/**
 * Interpolates variables with the translation string
 * @param  {String} string - translation label
 * @param  {Object} params - dynamic properties
 * @return {String}
 */
function interpolate (string, params) {
  if (!params) {
    return string
  }

  let originalString = string
  let propErrors = []

  const betweenCurlyBracesRegEx = new RegExp(/\{.*?}s?/g)
  const matchedParams = string.match(betweenCurlyBracesRegEx)
  const paramsKeys = Object.keys(params)

  if (!matchedParams) {
    return
  }

  matchedParams.forEach((match, i) => {
    const prop = match.slice(1, -1)
    const value = params[prop]
    const paramKey = paramsKeys[i]

    if (!value && paramKey) {
      propErrors.push(paramKey)
      return
    }

    string = string.replace(match, value)
  })

  warnPropertyError(propErrors, originalString)

  return string
}

/**
 * Set language
 * It sets the new requested language, replaces the url prefix in the url
 * and returns translations which are then applyed using vue-i18n.
 * If no language is passed, the language will be the one choosen as default
 * @param {String} [code=defaultCode] - the new language code
 * @param {Boolean} [replaceRoute=true] - a check for routes manipulations
 * @return {Promise}
 */
function setLanguage (router, store) {
  return function (code = store.getters.defaultCode, replaceRoute = true) {
    return store.dispatch(events.SET_LANGUAGE, code).then(() => {
      if (!replaceRoute || !router) {
        return
      }

      updateURLPrefix(router, store.getters.currentLanguage.urlPrefix)
    })
  }
}

/**
 * Translation
 * @param  {String} label - translation label
 * @param  {Object} params - translation dynamic properties
 * @return {String}
 */
export function translate (store) {
  return function (label, params) {
    const { translation, currentLanguage } = store.getters
    const translationKey = currentLanguage.translationKey
    const keys = label.split('.')

    let value = translation

    while (keys.length) {
      const key = keys.shift()

      if (!value[key]) {
        warn(`"${label}" key doesn't exist in "${translationKey}" translation object`)
        return label
      }

      value = value[key]
    }

    if (typeof value !== 'string') {
      value = null
    }

    if (!translation || !value) {
      return label
    }

    return interpolate(value, params)
  }
}

export default function (Vue, router, store) {
  Vue.prototype.$setLanguage = setLanguage(router, store)
  Vue.prototype.$t = translate(store)
}
