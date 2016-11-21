import each from 'lodash/each'
import map from 'lodash/map'
import replace from 'lodash/replace'
import keys from 'lodash/keys'

import { SET_LANGUAGE } from './store/module/events'
import { updateURLPrefix } from './router'
import { warn } from './utils'

/**
 * To better manage errors and typos, every errors will be logged in the console
 * with the current translated value
 */
const warnPropertyError = (errors, context) => {
  if (errors.length > 0) {
    errors = map(errors, error => `"${error}"`)

    warn(`No match found for ${errors.join(', ')} in "${context}"`)
  }
}

/**
 * Interpolates variables with the translation string
 * @param  {String} string - translation label
 * @param  {Object} params - dynamic properties
 * @return {String}
 */
const interpolate = (string, params) => {
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
const setLanguage = (router, store) => {
  return async function (code = store.getters.defaultCode, replaceRoute = true) {
    await store.dispatch(SET_LANGUAGE, code)

    if (!replaceRoute || !router) {
      return
    }

    updateURLPrefix(router, store.getters.currentLanguage.urlPrefix)
  }
}

/**
 * Translation
 * @param  {String} label - translation label
 * @param  {Object} params - translation dynamic properties
 * @return {String}
 */
export const translate = (store) => {
  return function (label, params) {
    const { translations } = store.getters
    const value = translations[label]

    if (!translations || !value) {
      return label
    }

    return interpolate(value, params)
  }
}

export default function (Vue, router, store) {
  Vue.prototype.$setLanguage = setLanguage(router, store)
  Vue.prototype.$t = translate(store)
}
