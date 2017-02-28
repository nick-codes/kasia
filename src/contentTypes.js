import wpFilterMixins from 'wpapi/lib/mixins/filters'
import wpParamMixins from 'wpapi/lib/mixins/parameters'
import humps from 'humps'

import getWP from './wpapi'
import invariants from './invariants'
import { WpApiNamespace, ContentTypes, ContentTypesPlural } from './constants'

export default { register, registerFromInstance, get, getAll, derive }

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
    name, plural, slug, route, methodName
  } = contentType

  const typeMethod = methodName || humps.camelize(plural)

  const options = {
    ...contentType,
    route: route || `/${slug}/(?P<id>)`,
    call: (wpapi, id) => {
      invariants.isCustomContentTypeMethod(wpapi, typeMethod, name)
      return wpapi[typeMethod](id).embed().get()
    }
  }

  // Only register custom types with node-wpapi instance as built-ins are already available
  if (registerOnInstance) {
    getWP().then((wpapi) => {
      wpapi[methodName] = wpapi.registerRoute(namespace, route, { mixins })
    })
  }

  optionsCache.set(name, options)
}

/** Register custom content types found on a `node-wpapi` instance produced by autodiscovery. */
function registerFromInstance (site) {
  if (!site) return

  Object.keys(site).forEach((key) => {
    if (
      key[0] === '_' || // ignore private properties
      typeof value !== 'function' || // ignore non-methods
      ContentTypesPlural[key] // ignore pre-registered built-ins
    ) return

    const value = site[key]

    register({
      name: value,
      plural: value,
      slug: value
    }, false)
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
