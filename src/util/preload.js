import { put, join, fork } from 'redux-saga/effects'

import invariants from './invariants'
import { completeRequest } from '../redux/actions'

/** Make a preloader saga for all Kasia components within the `components` array. */
export function preload (components, renderProps = {}, state = {}) {
  invariants.isArray('components', components)
  invariants.isObject('renderProps', renderProps)
  invariants.isObject('state', state)

  return function * () {
    const tasks = yield components
      .filter((c) => typeof c.preload === 'function')
      .map((component) => component.preload(renderProps, state))
      .map(([ fn, action ]) => fork(fn, action))

    if (tasks.length) {
      yield join(...tasks)
    }
  }
}

/** Make a preloader saga that fetches data for an arbitrary WP API query. */
export function preloadQuery (queryFn, renderProps = {}, state = {}) {
  invariants.isFunction('queryFn', queryFn)
  invariants.isObject('renderProps', renderProps)
  invariants.isObject('state', state)

  return function * () {
    const data = yield queryFn(renderProps, state)
    yield put(completeRequest(null, data))
  }
}

/**
 * Run all `sagas` until they are complete.
 * @param {Object} store Enhanced redux store with `runSaga` method
 * @param {Array} sagas Array of saga operations
 * @returns {Promise}
 */
export function runSagas (store, sagas) {
  invariants.isEnhancedStore(store)
  invariants.isArray('sagas', sagas)

  return sagas.reduce((promise, saga) => {
    return promise.then(() => {
      const state = store.getState()
      return store.runSaga(saga(state)).done
    })
  }, Promise.resolve())
}
