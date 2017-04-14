import { translate } from '../src/locale'
import _ from 'lodash'

global.console.warn = jest.fn()
global.console.error = jest.fn()

describe('translate', function () {
  it('should interpolate a variable in the string', function () {
    const store = createGetterInStore('translation', {
      message: 'foo is equal to {foo}',
      author: {
        name: 'matteo {surname}'
      }
    })

    const $t = translate(store)

    expect($t('message', { foo: 'bar' })).toEqual('foo is equal to bar')
    expect($t('author.name', { surname: 'gabriele' })).toEqual('matteo gabriele')
  })

  it('should return a string', function () {
    const store = createGetterInStore('translation', {
      message: 'hello world',
      author: {
        name: 'matteo gabriele'
      }
    })

    const $t = translate(store)

    expect($t('blabla')).toEqual('blabla')
    expect($t('message')).toEqual('hello world')
    expect($t('author.name')).toEqual('matteo gabriele')
  })

  it('should log in the console when a wrong property is interpolated', function () {
    const store = createGetterInStore('translation', {
      message: 'hello {context}'
    })

    const $t = translate(store)

    $t('message', { foo: 'world' })

    expect(console.warn).toBeCalled()
  })
})

/**
 * Creates a mock of the store with the currentLanguage getter
 * @param  {String} getter name of the getter
 * @param  {any} value  value of the getter
 * @return {Object}
 */
function createGetterInStore (getter, value) {
  const store = {
    getters: {
      currentLanguage: {
        code: 'en_GB',
        translationKey: 'en',
        urlPrefix: 'en'
      }
    }
  }

  Object.defineProperty(store.getters, getter, {
    get () {
      return value
    }
  })

  return store
}
