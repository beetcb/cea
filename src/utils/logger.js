const { Signale } = require('signale')

const options = {
  types: {
    error: {
      label: '失败',
    },
    success: {
      label: '成功',
    },
    warn: {
      label: '警示',
    },
  },
}

module.exports = new Signale(options)
