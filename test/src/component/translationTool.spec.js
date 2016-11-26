import { expect } from 'chai'
import storageHelper from 'storage-helper'
import _ from 'lodash'
import VueI18nManager, { routeParser } from '../../../dist/vue-i18n-manager'
import mutations from '../../../src/store/module/mutations'
import storeState from '../../../src/store/module/state'
import events from '../../../src/store/module/events'

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

describe('<translation-tool />', () => {

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

  it ('should be able to translate hidden languages', () => {
    const newState = {
      languageFilter: [dutch.code],
      languages: [dutch, english, italian],
      defaultCode: dutch.code
    }

    mutations[events.UPDATE_CONFIGURATION](state, newState)

    expect(state.availableLanguages).to.lengthOf(1)

    mutations[events.SET_LANGUAGE](state, dutch.code)
    mutations[events.SET_LANGUAGE](state, english.code)

    expect(state.currentLanguage.code).to.equal(english.code)
  })
})
