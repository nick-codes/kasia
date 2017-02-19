/* global jest:false */

jest.disableAutomock()

import getWP, { setWP } from '../src/wpapi'

const instance = {}

describe('wpapi', () => {
  it('throws if getting unset instance', () => {
    expect(() => getWP()).toThrowError(/WP is not set/)
  })

  it('can set instance' ,() => {
    setWP(instance)
  })

  it('can get instance', () => {
    expect(getWP()).toEqual(instance)
  })
})
