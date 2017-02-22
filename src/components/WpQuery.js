import React from 'react'

import { connectWpQuery } from '../connect'
import invariant from '../util/invariant'
import sharer from './sharer'

export default function WpQuery (props) {
  invariant(typeof this.props.query === 'function', 'WpQuery expects `query`.')
  const child = sharer(props)
  return connectWpQuery(props.query, props.shouldUpdate)(child)
}

WpQuery.defaultProps = {
  shouldUpdate: () => false
}
