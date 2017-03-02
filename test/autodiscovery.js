import kasia from '../src'
import getWP from '../src/wpapi'
import contentTypes, { _makeWpapiMethodCaller } from '../src/contentTypes'
import { WpApiNamespace } from '../src/constants'

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
      expect(contentTypes.get('blogPosts')).toEqual({
        namespace: WpApiNamespace,
        name: 'blogPosts',
        plural: 'blogPosts',
        slug: 'blogPost',
        call: _makeWpapiMethodCaller('blogPosts')
      })
    })
  })

  it('delays querying until discovery is complete', () => {

  })
})
