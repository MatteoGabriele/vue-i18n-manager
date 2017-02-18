import { expect } from 'chai'

import _ from 'lodash'
import mutations from '../../../../src/store/module/mutations'
import storeState from '../../../../src/store/module/state'
import events from '../../../../src/store/module/events'

let state
let sandbox

const dutch = {
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

describe('Mutations', () => {

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(window.console, 'warn');
    sandbox.stub(window.console, 'error');

    state = { ...storeState }
  })

  afterEach(() => {
    sandbox.restore()
  })

  /**
   * ======================================
   * REMOVE_LANGUAGE_PERSISTENCY tests
   * ======================================
   */
  describe('REMOVE_LANGUAGE_PERSISTENCY', () => {
    it ('should remove persistency of language in the browser', () => {
      mutations[events.REMOVE_LANGUAGE_PERSISTENCY](state)
      expect(state.persistent).to.be.false
    })
  })

  /**
   * ======================================
   * UPDATE_CONFIGURATION tests
   * ======================================
   */
  describe('UPDATE_CONFIGURATION', () => {
    it ('should work without sending any configurations', () => {
      const newState = {}
      const translation = { message: 'hello world' }
      const code = dutch.code

      mutations[events.UPDATE_CONFIGURATION](state, newState)
      mutations[events.SET_LANGUAGE](state, state.defaultCode)
      mutations[events.SET_TRANSLATION](state, { translation, code })

      const { currentLanguage, translations } = state
      expect(currentLanguage).to.be.defined
      expect(_.size(translations)).to.equal(1)
      expect(translations[currentLanguage.translationKey].message).to.equal('hello world')
    })

    it ('should accept parameters that are in the default state only', () => {
      const newState = {
        foo: 'bar',
        defaultCode: dutch.code,
        languages: [dutch]
      }

      mutations[events.UPDATE_CONFIGURATION](state, newState)

      expect(state.foo).to.be.undefined
      expect(state.defaultCode).to.equal(dutch.code)
    })

    it ('should log a message if an invalid parameters is passed', () => {
      const newState = {
        foo: 'bar'
      }

      mutations[events.UPDATE_CONFIGURATION](state, newState)

      sinon.assert.calledOnce(console.warn)
    })

    it ('should log a message if the defaultCode doesn\'t match any language', () => {
      const newState = {
        defaultCode: dutch.code
      }

      mutations[events.UPDATE_CONFIGURATION](state, newState)

      sinon.assert.calledOnce(console.warn);
    })

    it ('should have a defaultCode that matches at least one available languages', () => {
      const newState = {
        defaultCode: dutch.code,
        languages: [dutch, italian, english]
      }

      mutations[events.UPDATE_CONFIGURATION](state, newState)

      expect(state.defaultCode).to.equal(dutch.code)

      expect(_.find(state.availableLanguages, { code: dutch.code })).to.deep.equal(dutch)
    })

    it ('should display only languages existing in the availableLanguages array', () => {
      const newState = {
        languageFilter: [italian.code, english.code],
        languages: [dutch, english, italian]
      }

      mutations[events.UPDATE_CONFIGURATION](state, newState)

      expect(state.availableLanguages.length).to.equal(2)
      expect(_.sortBy(state.availableLanguages, 'code')).to.deep.equal(_.sortBy([italian, english], 'code'))
    })
  })

  /**
   * ======================================
   * SET_TRANSLATION tests
   * ======================================
   */
  describe('SET_TRANSLATION', () => {
    it ('should return the translation based on the selected language', () => {
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

      const { id } = state.currentLanguage
      const translation = translations[id]

      mutations[events.SET_TRANSLATION](state, { translation, code: dutch.code })

      expect(state.translations[id]).to.deep.equal(translation)
    })
  })

  /**
   * ======================================
   * SET_LANGUAGE tests
   * ======================================
   */
  describe('SET_LANGUAGE', () => {
    it ('should set the currentLanguage based on a given language code', () => {
      const newState = {
        defaultCode: english.code,
        languages: [english]
      }

      mutations[events.UPDATE_CONFIGURATION](state, newState)

      mutations[events.SET_LANGUAGE](state, english.code)

      expect(state.currentLanguage.code).to.equal(english.code)
    })

    it ('should update the currentLanguage with a new one', () => {
      const newState = {
        languages: [dutch, english, italian]
      }

      mutations[events.UPDATE_CONFIGURATION](state, newState)

      mutations[events.SET_LANGUAGE](state, english.code)
      expect(state.currentLanguage.code).to.equal(english.code)

      mutations[events.SET_LANGUAGE](state, italian.code)
      expect(state.currentLanguage.code).to.equal(italian.code)
    })

    it ('should set the new language and retrieve its translation', () => {
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
      expect(code).to.equal(english.code)
      expect(state.translations[translationKey]).to.deep.equal(translation)
    })
  })
})
