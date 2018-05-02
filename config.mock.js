const model = data => async (ctx) => {
  ctx.type = 'json'
  ctx.body = JSON.stringify(data)
}

module.exports = {
  'POST /api/login': model({
    'code': 200,
    'msg': '',
    'data': {
      name: 'hahhah'
    }
  })
}
