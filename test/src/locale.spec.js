import { expect } from 'chai'
import _ from 'lodash'
import { translate } from '../../src/locale'

let sandbox

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
    let store = { getters: {} }

    Object.defineProperty(store.getters, 'translations', {
      get () {
        return {
          message: 'foo is equal to {foo}'
        }
      }
    })

    const $t = translate(store)

    expect($t('message', { foo: 'bar' })).to.equal('foo is equal to bar')
  })

  it ('should return a string', () => {
    let store = { getters: {} }

    Object.defineProperty(store.getters, 'translations', {
      get () {
        return {
          message: 'hello world'
        }
      }
    })

    const $t = translate(store)

    expect($t('dasd')).to.be.a('String')
    expect($t('message')).to.equal('hello world')
  })

  it ('should warn when a wrong property is interpolated', () => {
    let store = { getters: {} }

    Object.defineProperty(store.getters, 'translations', {
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
