/* global jest:false, expect:false */

jest.disableAutomock()

import '../__mocks__/wpapi'
import postJson from '../__fixtures__/wp-api-responses/post'
import { INITIAL_STATE, _acknowledgeReducer, _completeReducer, _failReducer } from '../../src/redux/reducer'

describe('redux/reducer', () => {
  const id = 0

  let state
  let query

  function assertNewObject (fn) {
    it('returns a new object', () => {
      const newState = fn()
      expect(typeof newState).toEqual('object')
      expect(newState === state).toEqual(false)
      state = newState
      query = state.queries[id]
    })
  }

  describe('acknowledge', () => {
    assertNewObject(() => _acknowledgeReducer(INITIAL_STATE, { id }))
    it('sets query on state', () => expect(query).toEqual({ id, prepared: true, complete: false, OK: null }))
  })

  describe('complete', () => {
    assertNewObject(() => _completeReducer((data) => data)(state, { id, data: [postJson] }))
    it('sets entity ids', () => expect(query.entities).toEqual([postJson.id]))
    it('sets complete', () => expect(query.complete).toEqual(true))
    it('sets OK', () => expect(query.OK).toEqual(true))
  })

  describe('fail', () => {
    const error = new Error('Wuh-oh!').stack

    assertNewObject(() => _failReducer(state, { id, error }))

    it('sets error', () => expect(query.error).toEqual(error))
    it('sets complete', () => expect(query.complete).toEqual(true))
    it('sets OK', () => expect(query.OK).toEqual(false))
  })
})
