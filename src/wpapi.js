import invariants from './util/invariants'

let WP

export default function getWP () {
  invariants.isOk(WP, 'WP not set')
  return WP
}

export function setWP (value) {
  WP = Promise.resolve(value).then((wpapi) => {
    // Check again that we have a `node-wpapi` instance if what
    // we were passed originally was a Promise from discovery
    invariants.isNodeWpapiInstance(wpapi)
    return wpapi
  })
  return WP
}
