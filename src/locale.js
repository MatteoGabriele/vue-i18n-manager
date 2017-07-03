import { setLanguage } from './store/language'
import { updateURLPrefix } from './router'
import { getPropByString } from './utils'

/**
 * Interpolates variables with the translation string
 * @param  {String} string - translation label
 * @param  {Object} params - dynamic properties
 * @return {String|Object}
 */
const interpolate = (string, params) => {
  if (!params) {
    return string
  }

  let originalString = string

  const betweenCurlyBracesRegEx = new RegExp(/\{.*?}s?/g)
  const matchedCurlies = string.match(betweenCurlyBracesRegEx)
  const paramsKeys = Object.keys(params)
  const paramKeyError = []

  if (!matchedCurlies) {
    return {
      error: {
        message: 'Missing matching keys in the given translation string'
      }
    }
  }

  matchedCurlies.forEach((match, i) => {
    const prop = match.slice(1, -1).trim()
    const value = params[prop]
    const paramKey = paramsKeys[i]

    if (prop !== paramKey) {
      paramKeyError.push(paramKey)
    }

    string = string.replace(match, value)
  })

  if (paramKeyError.length > 0) {
    return {
      error: {
        message: `${getKeysAsString(paramKeyError)} not matching given keys`
      }
    }
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
        console.error(
          '[vue-i18n-manager] ' +
          `"${label}" key doesn't exist in "${translationKey}" translation object`
        )

        return label
      }

      value = value[key]
    }

    if (typeof value !== 'string') {
      console.error(
        '[vue-i18n-manager] ' +
        `The value of "${label}" is not a string. ` +
        'You are probably looking for children of this element.'
      )
      return label
    }

    const interpolation = interpolate(value, params)

    if (interpolation.error) {
      console.error(
        '[vue-i18n-manager] ' +
        'An error occured during string interpolation. ' +
        interpolation.error.message
      )
    }

    return interpolation.error ? label : interpolation
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
