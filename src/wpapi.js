import invariants from './invariants'

let WP

export default function getWP () {
  invariants.isOk(WP, 'WP not set')
  return WP
}

export function setWP (_WP) {
  WP = Promise.resolve(_WP).then((wpapi) => {
    // Check again that we have a `node-wpapi` instance if what
    // we were passed originally was a Promise from discovery
    invariants.isNodeWpapiInstance(wpapi)
    return wpapi
  })
  return WP
}
