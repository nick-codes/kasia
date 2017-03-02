import * as effects from 'redux-saga/effects'

import debug from './util/debug'
import makeReducer from './redux/reducer'
import invariants from './util/invariants'
import contentTypes from './contentTypes'
import queryCounter from './util/queryCounter'
import { setWP } from './wpapi'
import { watchRequests } from './redux/sagas'
import { rewind as connectRewind } from './connect'
import { runSagas as _runSagas, preload, preloadQuery } from './util/preload'

export default kasia

export { runSagas, preload, preloadQuery }

kasia.rewind = rewind
kasia.runSagas = runSagas
kasia.preload = preload
kasia.preloadQuery = preloadQuery

// Components of the toolset that are extensible via plugins
const COMPONENTS_BASE = {
  sagas: [watchRequests],
  reducers: {}
}

/** Reset the internal query counter and first mount bool.
 *  Should be called before each SSR. */
function rewind () {
  connectRewind()
  queryCounter.reset()
}

/** Run all `sagas` until they are complete. */
function runSagas (store, sagas) {
  kasia.rewind()
  return _runSagas(store, sagas)
}

/** Merge plugins into internal sagas array and reducers object. */
function mergeComponents (plugins, wpapi, opts) {
  const components = { ...COMPONENTS_BASE }

  plugins.forEach((components, p, i) => {
    const isArr = p instanceof Array

    invariants.isPlugin('plugin at index ' + i, isArr ? p[0] : p)

    const { sagas = [], reducers = {} } = isArr
      ? p[0](wpapi, p[1] || {}, opts) // call plugin with user options
      : p(wpapi, {}, opts) // call plugin without user options

    components.sagas = [ ...components.sagas, ...sagas ]
    components.reducers = { ...components.reducers, ...reducers }
  })

  return components
}

/**
 * Configure Kasia.
 * @param {Object|Promise} opts.WP node-wpapi site or autodiscovery promise (deprecated)
 * @param {Object|Promise} opts.wpapi node-wpapi site or autodiscovery promise
 * @param {String} [opts.keyEntitiesBy] Property used to key entities in the store
 * @param {Boolean} [opts.debug] Log debug statements
 * @param {Array} [opts.plugins] Kasia plugins
 * @param {Array} [opts.contentTypes] Custom content type definition objects
 * @returns {Object} Kasia components
 */
function kasia (opts = {}) {
  let {
    WP,
    wpapi,
    keyEntitiesBy = 'id',
    plugins = [],
    debug: _debug = false,
    contentTypes: _contentTypes = []
  } = opts

  if (WP) {
    console.log('[kasia] config option `WP` is replaced by `wpapi` in v4.')
    wpapi = WP
  }

  debug.toggle(_debug)
  debug('initialised with: ', opts)

  invariants.isNodeWpapiInstance(wpapi)
  invariants.isOneOfAutoOrManualTypeRegistration(wpapi, _contentTypes)
  invariants.isKeyEntitiesByOption(keyEntitiesBy)
  invariants.isArray('plugins', plugins)
  invariants.isArray('contentTypes', _contentTypes)

  const { sagas, reducers } = mergeComponents(plugins, wpapi, opts)
  const usingAutodiscovery = typeof wpapi.then === 'function'

  setWP(wpapi)

  if (usingAutodiscovery) {
    debug('using autodiscovery for custom content types')
    wpapi.then(contentTypes.registerFromInstance)
  } else if (_contentTypes.length) {
    debug('using manual registration of custom content types')
    _contentTypes.forEach(contentTypes.register)
  }

  return {
    kasiaReducer: makeReducer({ keyEntitiesBy, reducers }),
    kasiaSagas: sagas.map((saga) => effects.spawn(saga))
  }
}
