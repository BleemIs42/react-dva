export const query = name => {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  return r && decodeURIComponent(r[2])
}

const getCookie = name => {
  const reg = new RegExp('(^|\\s)' + name + '=([^;]*)(;|$)')
  const r = document.cookie.match(reg)
  return r && decodeURIComponent(r[2])
}

const setCookie = (name, value, expiredays = 1) => {
  let exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = name + '=' + escape(value) + (expiredays == null ? '' : ';expires=' + exdate.toGMTString()) + ';path=/'
}

export const cookie = (...args) => {
  if (args.length === 1) {
    return getCookie(...args)
  }
  setCookie(...args)
}

export const toFd = (json) => {
  const fd = new FormData()
  if (typeof json === 'object') {
    Object.keys(json).forEach(key => {
      fd.append(key, json[key])
    })
  }
  return fd
}

export const toQs = (json) => {
  return Object.keys(json).map(key => `${key}=${json[key]}`).join('&')
}

export const exportCsv = (data, name) => {
  const prefix = '\uFEFF'
  const blob = new Blob([`${prefix}${data}`], {
    type: 'text/csv;charset=utf-8'
  })
  const a = document.createElement('a')
  a.download = `${name || '数据'}.csv`
  a.href = URL.createObjectURL(blob)
  a.click()
}
