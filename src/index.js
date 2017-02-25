import * as effects from 'redux-saga/effects'

import debug from './util/debug'
import makeReducer from './redux/reducer'
import invariants from './invariants'
import contentTypesManager from './util/contentTypesManager'
import queryCounter from './util/queryCounter'
import { setWP } from './wpapi'
import { watchRequests } from './redux/sagas'
import { rewind as connectRewind } from './connect'
import { runSagas as _runSagas, preload, preloadQuery } from './util/preload'

export default kasia

export { runSagas, preload, preloadQuery }

// Components of the toolset that are extensible via plugins
const COMPONENTS_BASE = {
  sagas: [watchRequests],
  reducers: {}
}

/** Reset the internal query counter and first mount bool.
 *  Should be called before each SSR. */
kasia.rewind = function rewind () {
  connectRewind()
  queryCounter.reset()
}

/** Run all `sagas` until they are complete. */
function runSagas (store, sagas) {
  kasia.rewind()
  return _runSagas(store, sagas)
}

/**
 * Configure Kasia.
 * @param {Object|Promise} opts.wpapi node-wpapi site or autodiscovery promise
 * @param {String} [opts.keyEntitiesBy] Property used to key entities in the store
 * @param {Boolean} [opts.debug] Log debug statements
 * @param {Array} [opts.plugins] Kasia plugins
 * @param {Array} [opts.contentTypes] Custom content type definition objects
 * @returns {Object} Kasia reducer
 */
function kasia (opts = {}) {
  let {
    WP,
    wpapi,
    debug: _debug = false,
    keyEntitiesBy = 'id',
    plugins = [],
    contentTypes = []
  } = opts

  debug.toggle(_debug)
  debug('initialised with: ', opts)

  if (WP) {
    console.log('[kasia] config option `WP` is replaced by `wpapi` in v4.')
    wpapi = WP
  }

  const usingAutodiscovery = typeof wpapi.then === 'function'

  invariants.isWpApiInstance(wpapi)
  invariants.notDiscoveryAndContentTypes(wpapi, contentTypes)
  invariants.isKeyEntitiesByOption(keyEntitiesBy)
  invariants.isArray('plugins', plugins)
  invariants.isArray('contentTypes', contentTypes)

  setWP(wpapi)

  if (usingAutodiscovery) wpapi.then(contentTypesManager.registerFromInstance)
  else contentTypes.forEach(contentTypesManager.register)

  // Merge plugins into internal sagas array and reducers object
  const { sagas, reducers } = plugins.reduce((components, p, i) => {
    const isArr = p instanceof Array
    invariants.isPlugin('plugin at index ' + i, isArr ? p[0] : p)
    const { sagas = [], reducers = {} } = isArr ? p[0](wpapi, p[1] || {}, opts) : p(wpapi, {}, opts)
    components.sagas = [ ...components.sagas, ...sagas ]
    components.reducers = { ...components.reducers, ...reducers }
    return components
  }, COMPONENTS_BASE)

  return {
    kasiaReducer: makeReducer({ keyEntitiesBy, reducers }),
    kasiaSagas: sagas.map((saga) => effects.spawn(saga))
  }
}
