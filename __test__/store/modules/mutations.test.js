import _ from 'lodash'

import languages from '../../__data__/languages'

import mutations from '../../../src/store/module/mutations'
import defaultState from '../../../src/store/module/state'
import events from '../../../src/store/module/events'

global.console.warn = jest.fn()
global.console.error = jest.fn()

const { dutch, italian, english } = languages

let state

beforeEach(function () {
  // create brand new instance of the default store
  state = { ...defaultState }
})

describe('remove language persistency', function () {
  it ('should disable language persistency', function () {
    mutations[events.REMOVE_LANGUAGE_PERSISTENCY](state)
    expect(state.persistent).toEqual(false)
  })
})

describe('update configuration', function () {
  it ('should accept parameters that are in the default state only', function () {
    const newState = {
      foo: 'bar',
      defaultCode: dutch.code,
      languages: [dutch]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(state.foo).toBeUndefined()
    expect(state.defaultCode).toEqual(dutch.code)
  })

  it ('should log deprecated parameters passed in the configuration', function () {
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

  it ('should log a message if an invalid parameters is passed', function () {
    const newState = {
      foo: 'bar'
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(console.warn).toBeCalled()
  })

  it ('should log a message if the defaultCode doesn\'t match any language', function () {
    const newState = {
      defaultCode: dutch.code
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(console.warn).toBeCalled()
  })

  it ('should have a defaultCode that matches at least one available languages', function () {
    const newState = {
      defaultCode: dutch.code,
      languages: [dutch, italian, english]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(state.defaultCode).toEqual(dutch.code)

    const language = _.find(state.availableLanguages, { code: dutch.code })

    expect(language).toMatchObject(dutch)
  })

  it ('should display only languages existing in the availableLanguages array', function () {
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
  it ('should add the italian translation to the translations object', () => {
    const translations = {
      [dutch.translationKey]: { hello: 'hallo' },
      [italian.translationKey]: { hello: 'ciao' }
    }

    const newState = {
      defaultCode: dutch.code,
      languages: [ dutch, italian ],
      translations: {
        [dutch.translationKey]: translations[dutch.translationKey]
      }
    }


    mutations[events.UPDATE_CONFIGURATION](state, newState)

    mutations[events.SET_LANGUAGE](state, state.defaultCode)

    const italianTranslation = translations[italian.translationKey]

    mutations[events.SET_TRANSLATION](state, {
      translation: italianTranslation,
      code: italian.code
    })

    expect(state.translations[italian.translationKey]).toMatchObject(italianTranslation)
  })
})

describe('set language', function () {
  it ('should set the current language based on a given language code', function () {
    const newState = {
      languages: [dutch, english, italian]
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    mutations[events.SET_LANGUAGE](state, english.code)
    expect(state.currentLanguage.code).toEqual(english.code)

    mutations[events.SET_LANGUAGE](state, italian.code)
    expect(state.currentLanguage.code).toEqual(italian.code)
  })

  it ('should fallback to default language when new language doesn\'t exist', function () {
    mutations[events.SET_LANGUAGE](state, italian.code)

    expect(state.defaultCode).toEqual(english.code)
    expect(state.currentLanguage.code).toEqual(english.code)
  })
})
