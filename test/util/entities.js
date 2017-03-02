import entities from '../../src/util/entities'

describe('util/entities', () => {
  describe('#pick', () => {
    it('picks an id', () => {
      const ids = entities.pickIds([{ id: 'id' }])
      expect(ids).toEqual(['id'])
    })

    it('picks id over slug for content type with id', () => {
      const ids = entities.pickIds([{ id: 'id', slug: 'slug', type: 'post' }])
      expect(ids).toEqual(['id'])
    })

    it('picks slug from content type without id', () => {
      const ids = entities.pickIds([{ taxonomy: 'category', slug: 'slug' }])
      expect(ids).toEqual(['slug'])
    })

    it('picks slug and id from multiple entities', () => {
      const ids = entities.pickIds([
        { taxonomy: 'category', slug: 'slug' },
        { type: 'post', id: 'id' }
      ])
      expect(ids).toEqual(['id', 'slug'])
    })
  })

  describe('#find', () => {
    it('should be a function', () => {
      expect(typeof entities.find).toEqual('function')
    })

    it('should filter entities by id', () => {
      const actual = entities.find({
        posts: { 0: { id: 0, slug: 'post', title: 'post' } },
        pages: { 1: { id: 1, slug: 'page', title: 'page' } }
      }, 'id', [0])
      const expected = {
        posts: { 0: { id: 0, slug: 'post', title: 'post' } }
      }
      expect(actual).toEqual(expected)
    })

    it('should filter entities by slug', () => {
      const actual = entities.find({
        posts: { 0: { id: 0, slug: 'post', title: 'post' } },
        pages: { 1: { id: 1, slug: 'page', title: 'page' } }
      }, 'slug', ['page'])
      const expected = {
        pages: { 1: { id: 1, slug: 'page', title: 'page' } }
      }
      expect(actual).toEqual(expected)
    })

    it('should filter entities by id, fallback on slug', () => {
      const actual = entities.find({
        posts: { 0: { slug: 'post', title: 'post' } },
        pages: { 1: { id: 1, slug: 'page', title: 'page' } }
      }, 'id', ['post'])
      const expected = {
        posts: { 0: { slug: 'post', title: 'post' } }
      }
      expect(actual).toEqual(expected)
    })

    it('should filter entities by slug, fallback on id', () => {
      const actual = entities.find({
        posts: { 0: { id: 0, slug: 'post', title: 'post' } },
        pages: { 1: { id: 1, title: 'page' } }
      }, 'slug', [1])
      const expected = {
        pages: { 1: { id: 1, title: 'page' } }
      }
      expect(actual).toEqual(expected)
    })
  })
})
