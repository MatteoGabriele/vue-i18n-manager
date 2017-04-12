import _ from 'lodash'
import mutations from '../../../src/store/module/mutations'
import storeState from '../../../src/store/module/state'
import events from '../../../src/store/module/events'

global.console.warn = jest.fn()
global.console.error = jest.fn()

const dutch = {
  name: 'Dutch',
  code: 'nl-NL',
  urlPrefix: 'nl',
  translationKey: 'nl'
}
const english = {
  name: 'English',
  code: 'en-GB',
  urlPrefix: 'en',
  translationKey: 'en'
}
const italian = {
  name: 'Italiano',
  code: 'it-IT',
  urlPrefix: 'it',
  translationKey: 'it'
}

let state

beforeEach(function () {
  // create brand new instance of the default store
  state = { ...storeState }
})

describe('remove language persistency', function () {
  test ('remove language pensistency', function () {
    mutations[events.REMOVE_LANGUAGE_PERSISTENCY](state)
    expect(state.persistent).toEqual(false)
  })
})

describe('update configuration', function () {
  test ('accepts parameters that are in the default state only', function () {
    const newState = {
      foo: 'bar',
      defaultCode: dutch.code,
      languages: [dutch]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(state.foo).toBeUndefined()
    expect(state.defaultCode).toEqual(dutch.code)
  })

  test ('logs deprecated words passed in the configuration', function () {
    const newState = {
      translations: {
        [english.translationKey]: {
          message: 'hello world'
        }
      }
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    const { currentLanguage, translations } = state
    expect(currentLanguage).toBeDefined()
    expect(_.size(translations)).toEqual(1)
    expect(translations[currentLanguage.translationKey].message).toEqual('hello world')
  })

  test ('logs a message if an invalid parameters is passed', function () {
    const newState = {
      foo: 'bar'
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(console.warn).toBeCalled()
  })

  test ('logs a message if the defaultCode doesn\'t match any language', function () {
    const newState = {
      defaultCode: dutch.code
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(console.warn).toBeCalled()
  })

  test ('has a defaultCode that matches at least one available languages', function () {
    const newState = {
      defaultCode: dutch.code,
      languages: [dutch, italian, english]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(state.defaultCode).toEqual(dutch.code)

    const language = _.find(state.availableLanguages, { code: dutch.code })

    expect(language).toMatchObject(dutch)
  })

  test ('displays only languages existing in the availableLanguages array', function () {
    const newState = {
      languageFilter: [italian.code, english.code],
      languages: [dutch, english, italian]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(state.availableLanguages.length).toEqual(2)
    expect(_.sortBy(state.availableLanguages, 'code')).toMatchObject(_.sortBy([italian, english], 'code'))
  })
})

describe('set translation', function () {
  test ('returns the translation based on the selected language', () => {
    const translations = {
      [dutch.translationKey]: { hello: 'hallo' },
      [italian.translationKey]: { hello: 'ciao' }
    }

    const newState = {
      defaultCode: dutch.code,
      languages: [ dutch, italian ]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    mutations[events.SET_LANGUAGE](state, dutch.code)

    const { translationKey } = state.currentLanguage
    const translation = translations[translationKey]

    mutations[events.SET_TRANSLATION](state, { translation, code: dutch.code })

    expect(state.translations[translationKey]).toMatchObject(translation)
  })
})

describe('set language', function () {
  test ('sets the current language based on a given language code', function () {
    const newState = {
      languages: [dutch, english, italian]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    mutations[events.SET_LANGUAGE](state, english.code)
    expect(state.currentLanguage.code).toEqual(english.code)

    mutations[events.SET_LANGUAGE](state, italian.code)
    expect(state.currentLanguage.code).toEqual(italian.code)
  })

  test ('sets the new language and retrieve its translation', () => {
    const translation = {
      foo: 'bar'
    }
    const newState = {
      languages: [dutch, english]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    mutations[events.SET_LANGUAGE](state, english.code)

    mutations[events.SET_TRANSLATION](state, { translation, code: english.code })

    const { code, translationKey } = state.currentLanguage
    expect(code).toEqual(english.code)
    expect(state.translations[translationKey]).toMatchObject(translation)
  })
})
