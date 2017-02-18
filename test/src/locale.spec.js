import { expect } from 'chai'

import _ from 'lodash'
import { translate } from '../../src/locale'

let sandbox

const currentLanguage = {
  code: 'en_GB',
  translationKey: 'en',
  urlPrefix: 'en'
}

describe('Locale', () => {

  beforeEach(() => {
    sandbox = sinon.sandbox.create()
    sandbox.stub(window.console, 'warn');
    sandbox.stub(window.console, 'error');
  })

  afterEach(() => {
    sandbox.restore()
  })

  it ('should interpolate a variable in the string', () => {
    let store = {
      getters: {
        currentLanguage
      }
    }

    Object.defineProperty(store.getters, 'translation', {
      get () {
        return {
          message: 'foo is equal to {foo}',
          author: {
            name: 'matteo {surname}'
          }
        }
      }
    })

    const $t = translate(store)

    expect($t('message', { foo: 'bar' })).to.equal('foo is equal to bar')
    expect($t('author.name', { surname: 'gabriele' })).to.equal('matteo gabriele')
  })

  it ('should return a string', () => {
    let store = {
      getters: {
        currentLanguage
      }
    }

    Object.defineProperty(store.getters, 'translation', {
      get () {
        return {
          message: 'hello world',
          author: {
            name: 'matteo gabriele'
          }
        }
      }
    })

    const $t = translate(store)

    expect($t('dasd')).to.be.a('String')
    expect($t('message')).to.equal('hello world')
    expect($t('author.name')).to.equal('matteo gabriele')
  })

  it ('should return a string when using label with dot notation', () => {
    let store = {
      getters: {
        currentLanguage
      }
    }

    Object.defineProperty(store.getters, 'translation', {
      get () {
        return {
          author: {
            name: 'matteo gabriele'
          }
        }
      }
    })

    const $t = translate(store)

    expect($t('author.name')).to.equal('matteo gabriele')
  })

  it ('should warn when a wrong property is interpolated', () => {
    let store = {
      getters: {
        currentLanguage
      }
    }

    Object.defineProperty(store.getters, 'translation', {
      get () {
        return {
          message: 'hello {context}'
        }
      }
    })

    const $t = translate(store)

    $t('message', { foo: 'world' })

    sinon.assert.calledOnce(console.warn)
  })
})
