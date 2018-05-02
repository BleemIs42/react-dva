module.exports = {
  local: {
    staticHost: '/',
    apiHost: '',
    headers: {
      Accept: 'application/x.dev.test.com'
    }
  },
  dev: {
    staticHost: '/dev.test.com',
    apiHost: '//api.dev.test.com',
    headers: {
      Accept: 'application/x.dev.test.com'
    }
  },
  prod: {
    staticHost: '//test.com',
    apiHost: '//api.test.com',
    headers: {
      Accept: 'application/x.test.com'
    }
  }
}
