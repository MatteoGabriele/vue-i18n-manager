import storageHelper from 'storage-helper'

export const languages = state => state.languages

export const currentLanguage = state => state.currentLanguage

export const langUrlPrefix = state => state.currentLanguage.urlPrefix

export const defaultCode = state => {
  const { persistent, defaultCode, storageKey } = state
  const storagedLangCode = storageHelper.getItem(storageKey)

  if (persistent && storagedLangCode) {
    return storagedLangCode
  }

  return defaultCode
}
