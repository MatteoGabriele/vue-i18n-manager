import { setLanguage } from './store'
import { updateURLPrefix } from './router'
import { warn } from './utils'

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
  const matchedCurlies = string.match(betweenCurlyBracesRegEx)
  const paramsKeys = Object.keys(params)
  const paramKeyError = []

  if (!matchedCurlies) {
    throw new Error('Missing keys in the string to interpolate with the given parameters')
  }

  matchedCurlies.forEach((match, i) => {
    const prop = match.slice(1, -1).trim()
    const value = params[prop]
    const paramKey = paramsKeys[i]

    if (prop !== paramKey) {
      paramKeyError.push(paramKey)
    }

    if (!value && paramKey) {
      propErrors.push(paramKey)
    }

    string = string.replace(match, value)
  })

  if (paramKeyError.length > 0) {
    const keys = paramKeyError.map(i => `"${i}"`).join(', ')
    throw new Error(`${keys} not matching given keys`)
  }

  return string
}

/**
 * Translation
 * @param  {String} label - translation label
 * @param  {Object} params - translation dynamic properties
 * @return {String}
 */
export const translate = (store) => {
  return function (label, params) {
    const { translation, currentLanguage } = store.getters
    const translationKey = currentLanguage.key
    const keys = label.split('.')

    let value = translation

    if (Object.keys(value).length === 0) {
      return label
    }

    while (keys.length) {
      const key = keys.shift()

      if (!value[key]) {
        console.warn(
          '[vue-i18n-manager] ' +
          `"${label}" key doesn't exist in "${translationKey}" translation object`
        )
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

    try {
      return interpolate(value, params)
    } catch (error) {
      console.warn(
        '[vue-i18n-manager] ' +
        `"${label}" in "${currentLanguage.key}" translation. ${error.message}.`
      )

      return label
    }
  }
}

export default function (Vue, { router, store }) {
  Vue.prototype.$setLanguage = (code = store.getters.defaultCode, replaceRoute = true) => {
    return store.dispatch(setLanguage(code)).then(language => {
      if (replaceRoute && router) {
        updateURLPrefix(router, store.getters.currentLanguage.urlPrefix)
      }
      return language
    })
  }

  Vue.prototype.$t = translate(store)
}
