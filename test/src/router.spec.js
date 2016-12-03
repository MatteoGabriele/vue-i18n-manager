import { expect } from 'chai'

import _ from 'lodash'
import { localize } from '../../src/router'

describe('Router', () => {
  it ('should inject the language in the route', () => {
    const params = {}

    const route = localize({
      name: 'home',
      params
    }, 'en')

    expect(route.params.lang).to.equal('en')
  })

  it ('should merge all params in the route', () => {
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

    expect(route.params.lang).to.equal('en')
    expect(route.params.foo).to.equal('bar')
    expect(route.query.bar).to.equal('foo')
  })
})
