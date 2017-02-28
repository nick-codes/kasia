/* global jest:false, expect:false */

jest.disableAutomock()

import '../__mocks__/WP'
import contentTypes from '../../src/util/contentTypes'
import { ContentTypes } from '../../src/constants'

describe('util/contentTypes', () => {
  describe('#getAll', () => {
    it('returns an object', () => {
      const actual = typeof contentTypes.getAll()
      expect(actual).toEqual('object')
    })
  })

  describe('#get', () => {
    it('returns an object', () => {
      const actual = typeof contentTypes.get(ContentTypes.Post)
      expect(actual).toEqual('object')
    })
  })

  describe('#register', () => {
    it('throws with bad options object', () => {
      const fn = () => contentTypes.register('')
      expect(fn).toThrowError(/Invalid content type object/)
    })

    Object.values(ContentTypes).forEach((builtInType) => {
      it('throws when name is ' + builtInType, () => {
        const opts = { name: builtInType, plural: builtInType, slug: builtInType }
        const fn = () => contentTypes.register(opts)
        const expected = `Content type with name "${builtInType}" already exists.`
        expect(fn).toThrowError(expected)
      })
    })

    it('adds custom content type to cache', () => {
      const opts = { name: 'article', plural: 'articles', slug: 'articles' }
      contentTypes.register(opts)
      const actual = contentTypes.get('article')
      const expected = {
        ...opts,
        call: 'articles',
        route: '/articles/(?P<id>)'
      }
      expect(actual).toEqual(expected)
    })
  })
})
