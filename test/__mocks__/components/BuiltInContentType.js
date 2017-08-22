/* global jest:false */

// jest.disableAutomock() hoisted here by babel-jest

import React, { Component } from 'react'

import { ContentTypes } from '../../../src/constants'
import { connectWpPost } from '../../../src/connect'

jest.disableAutomock()

export class target extends Component {
  render () {
    const { query, post } = this.props.kasia
    if (!query.complete || !query.OK) return <div>Loading...</div>
    return <div>{post.title.rendered}</div>
  }
}

export default connectWpPost(
  ContentTypes.Post,
  // check for both id and slug so we can test both
  // usually you would target one or the other depending on `keyEntitiesBy`
  (props) => props.params.id || props.params.slug
)(target)
