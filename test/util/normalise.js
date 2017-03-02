/* global jest:false, expect:false */

jest.disableAutomock()

import '../__mocks__/wpapi'
import entities from '../../src/util/entities'
import contentTypes from '../../src/contentTypes'
import { _flushSchemas } from '../../src/schemas'
import { ContentTypes } from '../../src/constants'

function setup () {
  const testKeyById = true
  const testKeyBySlug = true

  contentTypes.register({
    name: 'book',
    plural: 'books',
    slug: 'books'
  })

  return {
    [ContentTypes.Category]: {
      // The expected entity collection on the store
      collection: 'categories',
      // Whether to test normalisation by 'id' attr.
      testKeyById,
      // Whether to test normalisation by 'slug' attr.
      testKeyBySlug
    },
    [ContentTypes.Comment]: {
      collection: 'comments',
      testKeyById
    },
    [ContentTypes.Media]: {
      collection: 'media',
      testKeyById
    },
    [ContentTypes.Page]: {
      collection: 'pages',
      testKeyById,
      testKeyBySlug
    },
    [ContentTypes.Post]: {
      collection: 'posts',
      testKeyById,
      testKeyBySlug
    },
    [ContentTypes.PostStatus]: {
      collection: 'statuses',
      testKeyBySlug
    },
    [ContentTypes.PostType]: {
      collection: 'types',
      testKeyBySlug
    },
    [ContentTypes.Tag]: {
      collection: 'tags',
      testKeyById,
      testKeyBySlug
    },
    [ContentTypes.Taxonomy]: {
      collection: 'taxonomies',
      testKeyBySlug
    },
    [ContentTypes.User]: {
      collection: 'users',
      testKeyById,
      testKeyBySlug
    },
    book: {
      collection: 'books',
      testKeyById,
      testKeyBySlug
    }
  }
}

function fixtures (contentType) {
  const first = require('../__fixtures__/wp-api-responses/' + contentType).default

  // Imitate another entity by modifying identifiers
  const second = Object.assign({}, first, {
    id: first.id + 1,
    slug: first.slug + '1'
  })

  return {
    first,
    second,
    multiple: [first, second]
  }
}

describe('normalise', () => {
  const tests = setup()

  Object.keys(tests).forEach((contentType) => {
    describe('Normalise ' + contentType, () => {
      const { plural } = contentTypes.get(contentType)
      const { first, second, multiple } = fixtures(contentType)
      const { collection, testKeyBySlug, testKeyById } = tests[contentType]

      afterEach(() => _flushSchemas())

      if (testKeyById) {
        it(`should normalise single "${contentType}" by id`, () => {
          const result = entities.normalise(first, 'id')
          const actual = Object.keys(result)
          expect(actual[0]).toEqual(collection)
        })

        it(`should normalise multiple "${contentType}" by id`, () => {
          const result = entities.normalise(multiple, 'id')
          const actual = Object.keys(result[plural])
          const expected = [first.id, second.id].map(String)
          expect(actual).toEqual(expected)
        })
      }

      if (testKeyBySlug) {
        it(`should normalise single "${contentType}" by slug`, () => {
          const result = entities.normalise(first, 'slug')
          const actual = Object.keys(result)
          expect(actual[0]).toEqual(collection)
        })

        it(`should normalise multiple "${contentType}" by slug`, () => {
          const result = entities.normalise(multiple, 'slug')
          const actual = Object.keys(result[plural])
          const expected = [first.slug, second.slug]
          expect(actual).toEqual(expected)
        })
      }
    })
  })
})
