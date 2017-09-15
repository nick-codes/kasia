/* global jest:false, expect:false */

jest.disableAutomock()

import '../__mocks__/WP'
import contentTypesManager from '../../src/util/content-types-manager'
import { ContentTypes } from '../../src/constants'

describe('util/contentTypesManager', () => {
  describe('#getAll', () => {
    it('returns an object', () => {
      const actual = typeof contentTypesManager.getAll()
      expect(actual).toEqual('object')
    })
  })

  describe('#get', () => {
    it('returns an object', () => {
      const actual = typeof contentTypesManager.get(ContentTypes.Post)
      expect(actual).toEqual('object')
    })
  })

  describe('#register', () => {
    it('throws with bad options object', () => {
      const fn = () => contentTypesManager.register('')
      expect(fn).toThrowError(/Invalid content type object/)
    })

    for (var builtInType in ContentTypes) {
      const typeName = ContentTypes[builtInType]
      it('throws when name is ' + typeName, () => {
        const opts = { name: typeName, plural: typeName, slug: typeName }
        const fn = () => contentTypesManager.register(opts)
        const expected = `Content type with name "${typeName}" already exists.`
        expect(fn).toThrowError(expected)
      })
    }

    it('adds custom content type to cache', () => {
      const opts = { name: 'article', plural: 'articles', slug: 'articles' }
      contentTypesManager.register(opts)
      const actual = contentTypesManager.getAll().get('article')
      const expected = Object.assign({}, opts, {
        methodName: 'articles',
        route: '/articles/(?P<id>)'
      })
      expect(actual).toEqual(expected)
    })
  })
})
