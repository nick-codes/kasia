import React from 'react'

/** Create a dumb component that passes its props to `children`. */
export default function createSharer (props) {
  return function Sharer () {
    if (typeof props.children === 'function') {
      return props.children
    } else {
      return React.Children.map(props.children, (child) => {
        return React.cloneElement(child, props)
      })
    }
  }
}
