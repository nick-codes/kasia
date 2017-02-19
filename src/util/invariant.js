/** Assert `predicate` is true, throw `message` otherwise. */
export default function invariant (predicate, message, ...args) {
  if (!predicate) {
    const interpolated = args.reduce((str, arg) => str.replace(/%s/, arg), message)
    const err = new Error('[kasia] ' + interpolated)
    err.framesToPop = 1
    throw err
  }
}
