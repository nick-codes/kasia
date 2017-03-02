import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import getWP from '../wpapi'
import contentTypes from '../contentTypes'
import ActionTypes from '../redux/ActionTypes'
import { acknowledgeRequest, completeRequest, failRequest } from './actions'

/** Make a fetch request to the WP-API and record result in the store. */
export function * fetch (action) {
  try {
    yield put(acknowledgeRequest(action))

    const wpapi = yield getWP()

    let data
    if (action.type === ActionTypes.RequestCreatePost) {
      const options = contentTypes.get(action.contentType)
      data = yield call(options.call, wpapi, action.identifier)
    } else if (action.type === ActionTypes.RequestCreateQuery) {
      data = yield call(action.queryFn, wpapi)
    }

    yield put(completeRequest(action.id, data))
  } catch (error) {
    yield put(failRequest(action.id, error.stack || error.message))
  }
}

/** Watch request create actions and fetch data for them. */
export function * watchRequests () {
  yield takeEvery([
    ActionTypes.RequestCreatePost,
    ActionTypes.RequestCreateQuery
  ], fetch)
}
