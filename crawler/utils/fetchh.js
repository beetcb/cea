const fetch = require('node-fetch')
const { cookieParse, cookieStr } = require('./cookie')

exports.Fetchh = class {
  cookieMap = null
  headers = {}

  constructor(headers) {
    headers = headers
  }

  async get(url) {
    return await this.fetch(url)
  }

  async post(url) {
    return await this.fetch(url, true)
  }

  async fetch(url, isPost) {
    const { host, origin } = new URL(url)
    const { headers } = this
    headers.origin = origin
    headers.host = host
    headers.cookie = cookieStr(cookieStr) || ''
    const res = await fetch(url, {
      headers,
      method: isPost ? 'POST' : undefined,
      redirect: 'manual',
    })
    this.updateMap(cookieParse(host, res.headers))
    return res
  }

  updateMap(newMap) {
    for ([key, val] of newMap) {
      const old = cookieMap.get(key)
      if (old.length) {
        cookieMap.set(key, [...old, ...val])
      } else {
        cookieMap.set(key, val)
      }
    }
  }
}
