import React from 'react'

/** Create a dumb component that passes its props to `children`. */
export default function createSharer (children) {
  return function Sharer () {
    if (typeof children === 'function') {
      return children
    } else {
      return React.Children.map(children, (child) => {
        return React.cloneElement(child, this.props)
      })
    }
  }
}
