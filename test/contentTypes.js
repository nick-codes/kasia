import './__mocks__/wpapi'
import contentTypes, { _makeWpapiMethodCaller } from '../src/contentTypes'
import { ContentTypes } from '../src/constants'

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

    it('throws when name is built-in', () => {
      const builtInType = ContentTypes.Post;
      const opts = { name: builtInType, plural: builtInType, slug: builtInType }
      const fn = () => contentTypes.register(opts)
      const expected = `Content type with name "${builtInType}" already exists.`
      expect(fn).toThrowError(expected)
    })

    it('adds custom content type to cache', () => {
      const opts = { name: 'article', plural: 'articles', slug: 'articles' }
      contentTypes.register(opts)
      const actual = contentTypes.get('article')
      expect(actual.name).toEqual(opts.name)
      expect(actual.plural).toEqual(opts.plural)
      expect(actual.slug).toEqual(opts.slug)
    })
  })
})
