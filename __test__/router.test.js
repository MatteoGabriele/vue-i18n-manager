import { localize } from '../src/router'

describe('localize', function () {
  test('should inject the language in the route', function () {
    const params = {}

    const route = localize({
      name: 'home',
      params
    }, 'en')

    expect(route.params.lang).toEqual('en')
  })

  test('should merge all params in the given route', function () {
    const params = {
      foo: 'bar'
    }

    const route = localize({
      name: 'home',
      params,
      query: {
        bar: 'foo'
      }
    }, 'en')

    expect(route.params.lang).toEqual('en')
    expect(route.params.foo).toEqual('bar')
    expect(route.query.bar).toEqual('foo')
  })
})
