/**
 * Parse http response headers
 * @param {string} host request url host
 * @param {map} headers raw cookie from fecth response headers
 * @return {map} cookie map
 */
exports.cookieParse = (host, headers) => {
  const rawCookies = headers.raw()['set-cookie']
  const map = new Map()
  if (!rawCookies) {
    return map
  }

  let [lastIdxMark, arr] = [null, []]
  for (e of rawCookies) {
    const [_, keyVal, path] = e.match(/(.*);(?:\s?)path=((\w+|\/)*)/i)
    if (!keyVal) {
      continue
    }
    const [key, val] = keyVal.split('=')
    const mapIdx = `${host}::${path}`
    if (lastIdxMark !== mapIdx) {
      if (lastIdxMark) {
        map.set(lastIdxMark, arr)
        arr = []
      }
    }
    lastIdxMark = mapIdx
    arr.push([key, val])
    // deprecated because of the numerous map set operations
    // map.set(mapIdx, [...(ownedKeyVal ? ownedKeyVal : []), { [key]: val }])
  }
  if (arr.length) {
    map.set(lastIdxMark, arr)
  }
  return map
}

/**
 * Construct a cookie obj base on path
 * @param {string} host request rul host
 * @param {string} path cookie path
 * @param {map} cookieMap cookie map
 */
exports.cookieStr = (host, path, cookieMap) => {
  const mapIdx = `${host}::${path}`
  const cookie = cookieMap.get(mapIdx)
  if (cookie) {
    return cookie.reduce((str, e) => {
      const [key, val] = e
      return str + `${key}=${val}; `
    }, '')
  }
}
