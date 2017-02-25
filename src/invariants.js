const NODE_WPAPI_GITHUB_URL = 'http://bit.ly/2adfKKg'
const KASIA_URL = 'http://kasia.io'

function invariant (predicate, message, ...args) {
  if (!predicate) {
    const interpolated = args.reduce((str, arg) => str.replace(/%s/, arg), message)
    const err = new Error('[kasia] ' + interpolated)
    err.framesToPop = 1
    throw err
  }
}

function typeCheck (type, name, value) {
  invariant(
    type === 'array' ? Array.isArray(value) : typeof value === type,
    'Expecting %s to be %s, got %s.',
    name, type, typeof value
  )
}

export default {
  isObject: typeCheck.bind(null, 'object'),
  isString: typeCheck.bind(null, 'string'),
  isFunction: typeCheck.bind(null, 'function'),
  isBoolean: typeCheck.bind(null, 'boolean'),
  isArray: typeCheck.bind(null, 'array'),
  isOk: (value, message) => invariant(value, message),
  isPlugin: (name, value) => invariant(
    typeof value === 'function',
    'Expecting %s to be function, got %s. ' +
    'Please file an issue with the plugin if you ' +
    'think there might be a problem with it.',
    name, typeof value
  ),
  isNodeWpapiInstance: (wpapi = {}) => invariant(
    wpapi && typeof (wpapi.then || wpapi.registerRoute) === 'function',
    'Expecting wpapi to be instance or promise of `node-wpapi`. ' +
    'See documentation: %s',
    NODE_WPAPI_GITHUB_URL
  ),
  isIdentifierArg: (identifier) => invariant(
    typeof identifier === 'function' || typeof identifier === 'string' || typeof identifier === 'number',
    'Expecting id given to connectWpPost to be function/string/number, got %s.',
    typeof identifier
  ),
  isValidContentTypeObject: (obj) => invariant(
    typeof obj.name === 'string' &&
    typeof obj.plural === 'string' &&
    typeof obj.slug === 'string',
    'Invalid content type object. ' +
    'See documentation: %s.',
    KASIA_URL
  ),
  isValidContentType: (contentTypeOptions, name, checkStr) => invariant(
    typeof contentTypeOptions !== 'undefined',
    'Content type "%s" is not recognised. ' +
    'Pass built-ins from `kasia/types`, e.g. `connectWpPost(Post, ...)`. ' +
    'Pass the name of custom content types, e.g. `connectWpPost("Book", ...)`. ' +
    'Check %s.',
    name, checkStr
  ),
  isNewContentType: (typesMap, contentType) => invariant(
    typesMap && !typesMap.get(contentType.name),
    'Content type with name "%s" already exists.',
    contentType.name
  ),
  isNotWrapped: (target, displayName) => invariant(
    !target.__kasia,
    '%s is already wrapped by Kasia.',
    displayName
  ),
  isIdentifierValue: (id) => invariant(
    typeof id === 'string' || typeof id === 'number',
    'The final identifier is invalid. ' +
    'Expecting a string or number, got %s.',
    typeof id
  ),
  isKasiaConfiguredStore: (wordpress) => invariant(
    wordpress,
    'No `wordpress` object on the store. ' +
    'Is your store configured correctly? ' +
    'See documentation %s.',
    typeof wordpress, KASIA_URL
  ),
  isKeyEntitiesByOption: (keyEntitiesBy) => invariant(
    keyEntitiesBy === 'slug' || keyEntitiesBy === 'id',
    'Expecting keyEntitiesBy to be "slug" or "id", got "%s".',
    keyEntitiesBy
  ),
  isOneOfAutoOrManualCustomContentTypeRegistration: (wpapi, contentTypes) => invariant(
    typeof wpapi.then === 'function' && !contentTypes.length ||
    typeof wpapi.then !== 'function' && contentTypes.length,
    'You must use only one of custom content type registration or autodiscovery.'
  ),
  isAvailableCustomContentTypeMethod: (wpapi, typeMethod, typeName) => invariant(
    typeof wpapi[typeMethod] === 'function',
    'Method `%s` does not exist on node-wpapi instance for "%s" content type.',
    typeMethod, typeName
  ),
  isEnhancedStore: (store) => invariant(
    typeof store === 'object' && typeof store.runSaga === 'function',
    'Expecting store to be object with `runSaga` enhancer method.'
  )
}
