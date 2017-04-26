import wpFilterMixins from 'wpapi/lib/mixins/filters'
import wpParamMixins from 'wpapi/lib/mixins/parameters'
import humps from 'humps'

import getWP from './wpapi'
import invariants from './util/invariants'
import { WpApiNamespace, ContentTypes, ContentTypesPlural } from './constants'

const api = { register, registerFromInstance, get, getAll, derive }

export default api

/** Create function that fetches an entity via a `node-wpapi` instance.
 *  @private */
export function _makeWpapiMethodCaller (typeMethod, typeName) {
  return (wpapi, identifier) => {
    invariants.isCustomContentTypeMethod(wpapi, typeMethod, typeName)
    const idMethod = typeof identifier === 'string' ? 'slug' : 'id'
    return wpapi[typeMethod]()[idMethod](identifier).embed().get()
  }
}

const optionsCache = new Map()
const mixins = { ...wpFilterMixins, ...wpParamMixins }

// Pre-populate cache with built-in content type options.
Object.keys(ContentTypes).forEach((key) => {
  const name = ContentTypes[key]
  const plural = ContentTypesPlural[name]
  const slug = ContentTypesPlural[name]
  register({ name, plural, slug }, false)
})

/** Assert that an object has all `keys`. */
function hasKeys (obj, ...keys) {
  return keys.reduce((bool, key) => {
    if (!bool) return bool
    return obj.hasOwnProperty(key)
  }, true)
}

/** Create and set options object for a type in the cache and register on wpapi instance. **/
function register (contentType, registerOnInstance = true) {
  invariants.isValidContentTypeObject(contentType)
  invariants.isNewContentType(getAll(), contentType)

  const {
    namespace = WpApiNamespace,
    name, plural, slug, methodName
  } = contentType

  const typeMethod = methodName || humps.camelize(plural)

  const options = {
    ...contentType,
    call: _makeWpapiMethodCaller(typeMethod, name)
  }

  if (registerOnInstance) {
    getWP().then((wpapi) => {
      const route = contentType.route || `/${slug}/(?P<id>)`
      wpapi[methodName] = wpapi.registerRoute(namespace, route, { mixins })
    })
  }

  // Key by both singular and plural for convenience
  optionsCache.set(name, options)
  optionsCache.set(plural, options)
}

/** Register custom content types found on a `node-wpapi` instance produced by autodiscovery. */
function registerFromInstance (site) {
  if (!site) return

  Object.keys(site).forEach((key) => {
    let name, plural, slug

    name = plural = slug = site[key]

    // Ignore private properties, non-methods, and pre-registered built-ins
    if (key[0] !== '_' && typeof name === 'function' &&  !ContentTypesPlural[key]) {
      register({ name, plural, slug }, false)
    }
  })
}

/** Get the options for a content type. */
function get (contentType) {
  return optionsCache.get(contentType)
}

/** Get all registered content types and their options. */
function getAll () {
  return optionsCache
}

/** Derive the content type of an entity from the WP-API. */
function derive (entity) {
  invariants.isObject('entity', entity)

  if (typeof entity.type !== 'undefined') {
    switch (entity.type) {
      case 'attachment': return ContentTypes.Media
      case 'comment': return ContentTypes.Comment
      case 'page': return ContentTypes.Page
      case 'post': return ContentTypes.Post
      default: return entity.type // Custom content type
    }
  }

  if (typeof entity.taxonomy !== 'undefined') {
    if (entity.taxonomy === 'post_tag') return ContentTypes.Tag
    if (entity.taxonomy === 'category') return ContentTypes.Category
  }

  if (entity.avatar_urls) return ContentTypes.User
  if (Array.isArray(entity.types)) return ContentTypes.Taxonomy
  if (hasKeys(entity, 'public', 'queryable', 'slug')) return ContentTypes.PostStatus
  if (hasKeys(entity, 'description', 'hierarchical', 'name')) return ContentTypes.PostType

  return null
}
