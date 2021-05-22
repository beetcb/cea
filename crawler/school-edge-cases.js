// @ts-check
const schoolEdgeCases = {
  宁波大学: {
    formIdx: 0,
    rememberMe: 'on',
    cookiePath: '/',
    checkCaptchaPath: '/needCaptcha.html',
    getCaptchaPath: '/captcha.html',
  },
}

// we will using proxy to get the default properties
const defaultProps = {
  rememberMe: true,
  getCaptchaPath: '/getCaptcha.htl',
  checkCaptchaPath: '/checkNeedCaptcha.htl',
  cookiePath: '/authserver',
  formIdx: 2,
  pwdEncrypt: true,
}

const iapDefaultProps = {
  lt: '/security/lt',
  rememberMe: true,
  checkCaptchaPath: '/checkNeedCaptcha',
  getCaptchaPath: '/generateCaptcha',
}

/**
 * handle edge cases, proxy default properties
 * @param {string} schoolName
 * @param {boolean} isIap
 */
module.exports = (schoolName, isIap) =>
  schoolName
    ? new Proxy(schoolEdgeCases[schoolName] || {}, {
        get(target, prop, receiver) {
          if (target[prop] === undefined) {
            return isIap ? iapDefaultProps[prop] : defaultProps[prop]
          }
          return Reflect.get(target, prop, receiver)
        },
      })
    : {}
