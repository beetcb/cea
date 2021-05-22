const fetch = require('node-fetch')
const { cookieParse, cookieStr } = require('./cookie')

exports.Fetchh = class {
  constructor(headers) {
    this.headers = headers
    this.cookieMap = null
    this.redirectUrl = null
  }

  async get(url, options = {}) {
    return await this.fetch(url, options)
  }

  async post(url, options) {
    options.isPost = true
    return await this.fetch(url, options)
  }

  /**
   * keep requesting last request url
   * @param {} options
   */
  async follow(options = {}) {
    return new Promise((resolve, reject) =>
      this.redirectUrl
        ? resolve(this.fetch(this.redirectUrl, options))
        : reject({ status: 555 })
    )
  }

  async fetch(url, options) {
    const { host, origin } = new URL(url)
    const { type, body, cookiePath } = options
    const { headers } = this

    headers.origin = origin
    headers.referer = origin
    headers.host = host
    headers.cookie = this.cookieMap
      ? cookieStr(host, cookiePath, this.cookieMap)
      : ''

    headers['Content-Type'] =
      type === 'form' ? 'application/x-www-form-urlencoded' : 'application/json'

    if (!type && headers['Content-Type']) {
      delete headers['Content-Type']
    }

    const res = await fetch(url, {
      headers,
      method: type ? 'POST' : undefined,
      body: body,
      redirect: 'manual',
    }).catch((err) => console.error(err))

    this.redirectUrl = res.headers.get('location') || this.redirectUrl
    this.updateMap(cookieParse(host, res.headers))
    return res
  }

  updateMap(newMap) {
    if (!this.cookieMap) {
      this.cookieMap = newMap
    } else {
      for (const [key, val] of newMap.entries()) {
        const old = this.cookieMap ? this.cookieMap.get(key) : []
        if (old) {
          this.cookieMap.set(key, [...old, ...val])
        } else {
          this.cookieMap.set(key, val)
        }
      }
    }
  }
}
