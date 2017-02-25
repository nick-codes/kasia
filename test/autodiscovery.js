/* global jest:false, expect:false */

jest.disableAutomock()

import kasia from '../src'
import getWP from '../src/wpapi'
import contentTypesManager from '../src/util/contentTypesManager'
import { WpApiNamespace } from '../src/constants'

describe('autodiscovery', () => {
  it('throws with both autodiscovery and manual registration', () => {
    expect(() => kasia({
      wpapi: Promise.resolve(true),
      contentTypes: [{}]
    }).toThrowError(/You must use only one/))
  })

  it('sets promise as internal wpapi record', () => {
    kasia({ wpapi: Promise.resolve(true) })
    return getWP().then((v) => expect(v).toEqual(true))
  })

  it('registers custom content types from instance', () => {
    kasia({
      wpapi: Promise.resolve({
        registerRoute: () => {},
        blogPosts: () => {}
      })
    })

    const types = contentTypesManager.getAll()

    //TODO complete expect
    expect(types.blogPosts).toEqual({
      namespace: WpApiNamespace,
      name: 'blogPosts',
      plural: 'blogPosts',
      slug: 'blogPost',
      route: '',
      call: () => {}
  })
  })

  it('delays querying until discovery is complete', () => {

  })
})
