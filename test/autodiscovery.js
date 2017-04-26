jest.mock('superagent')

import kasia from '../src'
import getWP from '../src/wpapi'
import contentTypes from '../src/contentTypes'

describe('autodiscovery', () => {
  it('sets promise as internal wpapi record', () => {
    const wpapi = Promise.resolve()
    kasia({ wpapi })
    expect(getWP()).toEqual(wpapi)
  })

  it('registers custom content types from instance', () => {
    const wpapi = Promise.resolve({
      registerRoute: () => {},
      blogPosts: () => {}
    })

    kasia({ wpapi })

    return wpapi.then(() => {
      const expected = contentTypes.get('blogPosts')
      expect(expected.name).toEqual('blogPosts')
      expect(expected.plural).toEqual('blogPosts')
      expect(expected.slug).toEqual('blogPosts')
    })
  })

  it('delays querying until discovery is complete', () => {

  })
})
