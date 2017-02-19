import { ContentTypes } from '../constants'
import { connectWpPost } from '../connect'
import { isDef } from '../util/helpers'
import invariant from '../util/invariant'
import sharer from './sharer'

/* Create a function to get or derive id or slug from props. */
function idOrSlug (componentName) {
  return (props) => {
    invariant(isDef(props.id) || isDef(props.slug), '%s expects `id` or `slug`.', componentName)
    if (typeof props.id !== 'undefined') return props.id
    if (typeof props.slug !== 'undefined') return props.slug
    if (typeof props.fromProps !== 'undefined') return props.fromProps
  }
}

// Single entity Post as WpPost, Page as WpPage, etc. components
Object.keys(ContentTypes).forEach((contentType) => {
  module.exports['Wp' + contentType] = function () {
    const child = sharer(this.props.children)
    return connectWpPost(ContentTypes[contentType], idOrSlug(contentType))(child)
  }
})
