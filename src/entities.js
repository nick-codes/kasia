import pickToArray from 'pick-to-array'
import { normalize, arrayOf } from 'normalizr'
import merge from 'lodash.merge'

import schemas from './schemas'
import contentTypes from './contentTypes'
import { ContentTypesWithoutId } from './constants'

const api = { pickIds, find, normalise }

export default api

const isDef = (v) => typeof v !== 'undefined'

/** Pick all entity identifiers from a WP-API response. */
function pickIds (response) {
  const entityIdentifiers = pickToArray(response, 'id')

  // Accommodate content types that do not have an `id` property
  ;[].concat(response).forEach((entity) => {
    const type = contentTypes.derive(entity)
    if (type in ContentTypesWithoutId) {
      entityIdentifiers.push(...pickToArray(entity, 'slug'))
    }
  })

  return entityIdentifiers
}

/** Filter `entities` to contain only those whose `idKey` is in `identifiers`. */
function find (entities, idKey, identifiers) {
  identifiers = identifiers.map(String)

  const reduced = {}

  for (const entityType in entities) {
    const entitiesOfType = entities[entityType]

    for (const key in entitiesOfType) {
      const entity = entitiesOfType[key]

      // Try to find entity by `idKey`
      // Fall back on id first, then slug, as for entities that don't
      // have an id `identifiers` will contain their slug and vice-versa
      const entityId = String(
        isDef(entity[idKey])
          ? entity[idKey] : isDef(entity.id)
            ? entity.id : entity.slug
      )

      if (!entityId) {
        console.log('[kasia] Could not derive id from entity: ' + JSON.stringify(entity))
      }

      if (entityId && identifiers.indexOf(entityId) !== -1) {
        reduced[entityType] = reduced[entityType] || {}
        reduced[entityType][key] = entity
      }
    }
  }

  return reduced
}

/** Split a response from the WP-API into its constituent entities. */
function normalise (response, idAttribute) {
  const contentTypeSchemas = schemas.getAll() || schemas.init(idAttribute)

  return [].concat(response).reduce((entities, entity) => {
    const type = contentTypes.derive(entity)

    if (!type) {
      console.log('[kasia] Could not derive type from entity: ' + JSON.stringify(entity))
      return entities
    }

    const contentTypeSchema = contentTypeSchemas[type]
      // Built-in content type or previously registered custom content type
      ? contentTypeSchemas[type]
      // Custom content type, will only get here once for each type
      : schemas.createSchema(type, idAttribute)

    const schema = Array.isArray(entity)
      ? arrayOf(contentTypeSchema)
      : contentTypeSchema

    const normalised = normalize(entity, schema)

    return merge(entities, normalised.entities)
  }, {})
}
