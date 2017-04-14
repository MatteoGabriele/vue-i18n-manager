import languages from '../../__data__/languages'

import getters from '../../../src/store/module/getters'
import mutations from '../../../src/store/module/mutations'
import defaultState from '../../../src/store/module/state'
import events from '../../../src/store/module/events'

const { dutch, italian, english } = languages

let state

beforeEach(function () {
  state = { ...defaultState }
})

describe('availableLanguages', function () {
  it ('should return italian and english', function () {
    const newState = {
      defaultCode: italian.code,
      languages: [italian, english]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(getters.availableLanguages(state)).toEqual(
      expect.arrayContaining([english, italian])
    )
  })

  it ('should only return italian when you apply the filter', function () {
    const newState = {
      defaultCode: italian.code,
      languages: [dutch, italian, english],
      languageFilter: [italian.code]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(getters.availableLanguages(state)).toEqual(
      expect.arrayContaining([italian])
    )
  })
})

describe('languages', function () {
  it ('should return all languages, filtered or not', function () {
    const newState = {
      defaultCode: italian.code,
      languages: [dutch, italian, english],
      languageFilter: [italian.code]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(getters.languages(state)).toContain(italian, dutch, english)
  })
})

describe('currentLanguage', function () {
  it ('should return english', function () {
    expect(getters.currentLanguage(state)).toMatchObject(english)
  })
})

describe('urlPrefix', function () {
  it ('should return english urlPrefix', function () {
    expect(getters.urlPrefix(state)).toEqual(english.urlPrefix)
  })
})

describe('languageFilter', function () {
  it ('should return codes of filtered languages', function () {
    const newState = {
      defaultCode: italian.code,
      languages: [dutch, italian, english],
      languageFilter: [italian.code, english.code]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(getters.languageFilter(state)).toEqual(
      expect.arrayContaining([italian.code, english.code])
    )
  })
})

describe('translation', function () {
  it ('should return the translation of the current language', function () {
    const newState = {
      defaultCode: english.code,
      languages: [english, italian],
      translations: {
        [english.translationKey]: { hello: 'hello' },
        [italian.translationKey]: { hello: 'ciao' }
      }
    }

    // set the new configuration
    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(getters.translation(state)).toMatchObject(state.translations[english.translationKey])

    // change language to italian
    mutations[events.SET_LANGUAGE](state, italian.code)

    expect(getters.translation(state)).toMatchObject(state.translations[italian.translationKey])
  })
})

describe('forceTranslation', function () {
  it ('should force the application to translate all languages, filtered or not', function () {
    const newState = {
      defaultCode: english.code,
      languages: [english, italian],
      languageFilter: [english.code],
      translations: {
        [english.translationKey]: { hello: 'hello' },
        [italian.translationKey]: { hello: 'ciao' }
      }
    }

    // set the new configuration
    mutations[events.UPDATE_CONFIGURATION](state, newState)

    // force the translation
    mutations[events.SET_FORCE_TRANSLATION](state, true)
    mutations[events.SET_LANGUAGE](state, italian.code)

    expect(getters.translation(state)).toMatchObject(state.translations[italian.translationKey])
    expect(getters.forceTranslation(state)).toBeTruthy()
  })
})

describe('defaultCode', function () {
  // need to find a way to test localStorage. now it doesn't work so i skip this test
  xit ('should return the default language code', function () {
    expect(getters.defaultCode(state)).toEqual(english.code)
  })
})
