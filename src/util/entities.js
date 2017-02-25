import pickToArray from 'pick-to-array'
import { normalize, arrayOf } from 'normalizr'
import merge from 'lodash.merge'

import schemasManager from './schemasManager'
import contentTypesManager from './contentTypesManager'
import { ContentTypesWithoutId } from '../constants'

const api = { pickIds, find, normalise }

export default api

const isDef = (v) => typeof v !== 'undefined'

/** Pick all entity identifiers from a WP-API response. */
function pickIds (response) {
  const entityIdentifiers = pickToArray(response, 'id')

    // Accommodate content types that do not have an `id` property
    ;[].concat(response).forEach((entity) => {
    const type = contentTypesManager.derive(entity)
    if (ContentTypesWithoutId.includes(type)) {
      entityIdentifiers.push(...pickToArray(entity, 'slug'))
    }
  })

  return entityIdentifiers
}

/** Filter `entities` to contain only those whose `keyToInspect` is in `identifiers`. */
function find (entities, keyToInspect, identifiers) {
  identifiers = identifiers.map(String)

  const reduced = {}

  for (const entityTypeName in entities) {
    const entitiesOfType = entities[entityTypeName]

    for (const key in entitiesOfType) {
      const entity = entitiesOfType[key]

      // Try to find entity by `keyToInspect` but fall back on id and then slug as
      // for entities that don't have an `id` identifiers will contain their slug
      // and vice-versa for entities that don't have a `slug`
      let entityId = isDef(entity[keyToInspect])
        ? entity[keyToInspect]
        : isDef(entity.id) ? entity.id : entity.slug

      entityId = String(entityId)

      if (identifiers.indexOf(entityId) !== -1) {
        reduced[entityTypeName] = reduced[entityTypeName] || {}
        reduced[entityTypeName][key] = entity
      }
    }
  }

  return reduced
}

/** Split a response from the WP-API into its constituent entities. */
function normalise (response, idAttribute) {
  const schemas = schemasManager.getAll() || schemasManager.init(idAttribute)

  return [].concat(response).reduce((entities, entity) => {
    const type = contentTypesManager.derive(entity)

    if (!type) {
      console.log(
        `[kasia] could not derive entity type - ignoring.`,
        `Entity: ${entity ? JSON.stringify(entity) : typeof entity}`
      )
      return entities
    }

    const contentTypeSchema = schemas[type]
      // Built-in content type or previously registered custom content type
      ? schemas[type]
      // Custom content type, will only get here once for each type
      : schemasManager.createSchema(type, idAttribute)

    const schema = Array.isArray(entity)
      ? arrayOf(contentTypeSchema)
      : contentTypeSchema

    const normalised = normalize(entity, schema)

    return merge(entities, normalised.entities)
  }, {})
}

