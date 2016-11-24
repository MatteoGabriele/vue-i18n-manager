import { warn } from './utils'
import keys from 'lodash/keys'
import difference from 'lodash/difference'
import each from 'lodash/each'
import find from 'lodash/find'

export const defineLanguage = (language) => {
  const mandatory = ['code', 'translateTo', 'urlPrefix']
  const languageKeys = keys(language)
  const differences = difference(mandatory, languageKeys)

  if (differences.length) {
    warn(`Invalid language definition. Property ${differences.join(', ')} missing.`)
    return
  }

  return language
}

/**
 * Warns if the default language code matches at least one of the provided languages,
 * otherwise the application could break.
 * @param  {Array} languages
 * @param  {String} code
 * @return {Object}
 */
export const defineLanguages = (languages, code) => {
  const language = find(languages, { code })

  if (!language) {
    warn('The default code must matches at least one language in the provided list')
  }

  return language
}

/**
 * Checks invalid and deprecated keys
 * @param  {Array} allowedKeys
 * @param  {Array} paramsKeys
 * @param  {String} context
 * @param  {Array}  [deprecatedKeys=[]]
 */
export const defineKeys = (newKeys, allowedKeys, context, deprecatedKeys = []) => {
  const invalidKeyes = difference(newKeys, allowedKeys)

  if (invalidKeyes.length) {
    each(invalidKeyes, key => {
      const deprecated = find(deprecatedKeys, { old: key })

      if (deprecated) {
        warn(`"${key}" is a deprecated parameter. Please use "${deprecated.new}"`)
        return
      }

      warn(`"${key}" is not a valid parameter to pass to ${context}`)
    })

    return false
  }

  return true
}
