import sharer from '../../src/components/sharer'

describe('components/sharer', () => {
  it('returns a function', () => {
    expect(typeof sharer()).toEqual('function')
  })

  it('should return children as-is when function', () => {
    const fn = () => {}
    expect(sharer(fn)()).toEqual(fn)
  })

  // TODO test remaining functionality
})
