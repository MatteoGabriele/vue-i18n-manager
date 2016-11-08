import storageHelper from 'storage-helper'
import find from 'lodash/find'

export const languages = state => state.languages

export const currentLanguage = state => state.currentLanguage

export const langUrlPrefix = state => state.currentLanguage.urlPrefix

export const defaultCode = state => {
  const { persistent, defaultCode, storageKey, languages } = state
  const storagedLangCode = storageHelper.getItem(storageKey)

  if (persistent && storagedLangCode) {
    /**
     * This part is actually checking if the language stored exists in the
     * current array of languages, otherwise it means that our localstorage value
     * is too old and we forgot to remove it from the browser memory.
     */
    const exists = find(languages, { code: storagedLangCode })

    if (exists) {
      return storagedLangCode
    }
  }

  return defaultCode
}
