import { expect } from 'chai'
import storageHelper from 'storage-helper'
import _ from 'lodash'
import VueI18nManager, { routeParser } from '../../../dist/vue-i18n-manager'
import mutations from '../../../src/store/module/mutations'
import storeState from '../../../src/store/module/state'
import {
  REMOVE_LANGUAGE_PERSISTENCY,
  UPDATE_I18N_STATE,
  SET_LANGUAGE,
  SET_TRANSLATION
} from '../../../src/store/module/events'

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

describe('Language tester', () => {

  beforeEach(() => {
    storageHelper.clear()

    sandbox = sinon.sandbox.create()
    sandbox.stub(window.console, 'warn');
    sandbox.stub(window.console, 'error');

    state = { ...storeState, forceTranslation: true }
  })

  afterEach(() => {
    sandbox.restore()
  })

  it ('should allow the component to use all languages', () => {
    const newState = {
      languageFilter: [dutch.code],
      languages: [dutch, english, italian],
      defaultCode: dutch.code
    }

    mutations[UPDATE_I18N_STATE](state, newState)

    expect(state.availableLanguages).to.lengthOf(1)

    mutations[SET_LANGUAGE](state, dutch.code)
    mutations[SET_LANGUAGE](state, english.code)

    expect(state.currentLanguage.code).to.equal(english.code)
  })

  it ('should be able to switch to all languages', () => {
    const newState = {
      languageFilter: [dutch.code],
      languages: [dutch, english, italian],
      defaultCode: italian.code
    }

    mutations[UPDATE_I18N_STATE](state, newState)

    mutations[SET_LANGUAGE](state, english.code)
    expect(state.currentLanguage.code).to.equal(english.code)

    mutations[SET_LANGUAGE](state, dutch.code)
    expect(state.currentLanguage.code).to.equal(dutch.code)

    mutations[SET_LANGUAGE](state, italian.code)
    expect(state.currentLanguage.code).to.equal(italian.code)
  })
})
