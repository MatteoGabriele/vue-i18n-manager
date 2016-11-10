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

/**
 * The storeState needs to be reset every time an assumption runs,
 * so to achieve that, the storeState needs to be copied in a local variable
 */
let state

const dutch = {
  code: 'nl-NL',
  urlPrefix: 'nl',
  translateTo: 'nl-NL'
}
const english = {
  name: 'English',
  code: 'en-GB',
  urlPrefix: 'en',
  translateTo: 'en-GB'
}
const italian = {
  name: 'Italiano',
  code: 'it-IT',
  urlPrefix: 'it',
  translateTo: 'it-IT'
}

/**
 * Create the new copy of the original store every time
 */
beforeEach(() => {
  state = { ...storeState }
})

describe('REMOVE_LANGUAGE_PERSISTENCY', () => {
  it ('should set the persistent parameter to false', () => {
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

  it ('should throw an error if the defaultCode doesn\'t match any listed languages', () => {
    const newState = {
      defaultCode: dutch.code
    }

    try {
      mutations[UPDATE_I18N_STATE](state, newState)
    } catch (error) {
      expect(state.error).to.be.true
    }
  })

  it ('should a defaultCode which matches at least one of the listed languages', () => {
    const newState = {
      defaultCode: dutch.code,
      languages: [dutch, italian, english]
    }

    mutations[UPDATE_I18N_STATE](state, newState)

    expect(state.defaultCode).to.equal(dutch.code)
    expect(state.languages[0].code).to.equal(dutch.code)
  })

  it ('should display only the availableLanguages', () => {
    const newState = {
      availableLanguages: [italian.code, english.code],
      languages: [dutch, english, italian]
    }

    mutations[UPDATE_I18N_STATE](state, newState)

    expect(state.languages.length).to.equal(2)
    expect(_.sortBy(state.languages, 'code')).to.deep.equal(_.sortBy([italian, english], 'code'))
  })
})

describe('SET_LANGUAGE', () => {
  it ('should set the currentLanguage based on a given language code', () => {
    mutations[SET_LANGUAGE](state, english.code)
    expect(state.currentLanguage.code).to.equal(english.code)
  })

  it ('should update the currentLanguage with a new one', () => {
    state = {
      languages: [dutch, english, italian]
    }

    mutations[SET_LANGUAGE](state, english.code)
    expect(state.currentLanguage.code).to.equal(english.code)

    mutations[SET_LANGUAGE](state, italian.code)
    expect(state.currentLanguage.code).to.equal(italian.code)
  })
})
