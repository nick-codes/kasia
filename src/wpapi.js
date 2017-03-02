import invariants from './util/invariants'

let wpapi

export default function getWP () {
  invariants.isOk(wpapi, 'WP not set')
  return wpapi
}

export function setWP (value) {
  wpapi = Promise.resolve(value).then((wpapi) => {
    // Check again that we have a `node-wpapi` instance if what
    // we were passed originally was a Promise from discovery
    invariants.isNodeWpapiInstance(wpapi)
    return wpapi
  })
  return wpapi
}
