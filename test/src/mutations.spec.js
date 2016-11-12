import { expect } from 'chai'

import _ from 'lodash'
import VueI18nManager, { routeParser } from '../../dist/vue-i18n-manager'
import mutations from '../../src/store/module/mutations'
import storeState from '../../src/store/module/state'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_STATE,
  SET_LANGUAGE,
  SET_TRANSLATION
} from '../../src/store/module/events'

let state
let sandbox

const dutch = {
  code: 'nl-NL',
  urlPrefix: 'nl',
  translateTo: 'nl_NL'
}
const english = {
  name: 'English',
  code: 'en-GB',
  urlPrefix: 'en',
  translateTo: 'en_GB'
}
const italian = {
  name: 'Italiano',
  code: 'it-IT',
  urlPrefix: 'it',
  translateTo: 'it_IT'
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

  describe('REMOVE_LANGUAGE_PERSISTENCY', () => {
    it ('should remove persistency of language in the browser', () => {
      mutations[REMOVE_LANGUAGE_PERSISTENCY](state)
      expect(state.persistent).to.be.false
    })
  })

  describe('UPDATE_I18N_STATE', () => {
    it ('should accept parameters that are in the default state only', () => {
      const newState = {
        foo: 'bar',
        defaultCode: dutch.code,
        languages: [dutch]
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      expect(state.foo).to.be.undefined
      expect(state.defaultCode).to.equal(dutch.code)
    })

    it ('should log a message if an invalid parameters is passed', () => {
      const newState = {
        foo: 'bar'
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      sinon.assert.calledOnce(console.warn)
    })

    it ('should log a message if the defaultCode doesn\'t match any language', () => {
      const newState = {
        defaultCode: dutch.code
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      sinon.assert.calledOnce(console.warn);
    })

    it ('should have a defaultCode that matches at least one available languages', () => {
      const newState = {
        defaultCode: dutch.code,
        languages: [dutch, italian, english]
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      expect(state.defaultCode).to.equal(dutch.code)

      expect(_.find(state.availableLanguages, { code: dutch.code })).to.deep.equal(dutch)
    })

    it ('should display only languages existing in the availableLanguages array', () => {
      const newState = {
        languageFilter: [italian.code, english.code],
        languages: [dutch, english, italian]
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      expect(state.availableLanguages.length).to.equal(2)
      expect(_.sortBy(state.availableLanguages, 'code')).to.deep.equal(_.sortBy([italian, english], 'code'))
    })

    it ('should log a message for depracated parameter usage', () => {
      const newState = {
        availableLanguages: [italian.code, english.code]
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      sinon.assert.calledOnce(console.warn)
    })
  })

  describe('SET_TRANSLATION', () => {
    it ('should return the translation based on the selected language', () => {
      const translations = {
        [dutch.translateTo]: { hello: 'hallo' },
        [italian.translateTo]: { hello: 'ciao' }
      }

      const newState = {
        defaultCode: dutch.code,
        languages: [ dutch, italian ]
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      mutations[SET_LANGUAGE](state, dutch.code)

      const { translateTo } = state.currentLanguage
      const translation = translations[translateTo]

      mutations[SET_TRANSLATION](state, translation)

      expect(state.translations).to.deep.equal(translation)
    })
  })

  describe('SET_LANGUAGE', () => {
    it ('should set the currentLanguage based on a given language code', () => {
      const newState = {
        defaultCode: english.code,
        languages: [english]
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      mutations[SET_LANGUAGE](state, english.code)

      expect(state.currentLanguage.code).to.equal(english.code)
    })

    it ('should update the currentLanguage with a new one', () => {
      const newState = {
        languages: [dutch, english, italian]
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      mutations[SET_LANGUAGE](state, english.code)
      expect(state.currentLanguage.code).to.equal(english.code)

      mutations[SET_LANGUAGE](state, italian.code)
      expect(state.currentLanguage.code).to.equal(italian.code)
    })

    it ('should set the new language and retrieve its translation', () => {
      const translations = {
        foo: 'bar'
      }
      const newState = {
        languages: [dutch, english]
      }

      mutations[UPDATE_I18N_STATE](state, newState)

      mutations[SET_LANGUAGE](state, english.code)

      mutations[SET_TRANSLATION](state, translations)

      expect(state.currentLanguage.code).to.equal(english.code)
      expect(state.translations).to.deep.equal(translations)
    })
  })
})
