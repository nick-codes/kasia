import React from 'react'

import { connectWpQuery } from '../connect'
import invariant from '../util/invariant'
import sharer from './sharer'

export default function WpQuery () {
  invariant(typeof this.props.query === 'function', 'WpQuery expects `query`.')
  const { query, shouldUpdate, children } = this.props
  const child = sharer(children)
  return connectWpQuery(query, shouldUpdate)(child)
}

WpQuery.defaultProps = {
  shouldUpdate: () => false
}
