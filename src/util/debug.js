let on = false

export default function debug (...args) {
  if (on) console.log('[kasia debug]', ...args)
}

debug.toggle = (bool) => {
  on = bool
}
