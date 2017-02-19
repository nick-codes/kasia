import invariants from './invariants'

let WP

export default function getWP () {
  invariants.hasWP(WP)
  return WP
}

export function setWP (_WP) {
  WP = _WP
  return WP
}
