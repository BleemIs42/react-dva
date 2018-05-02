import dva from 'dva'
import createLoading from 'dva-loading'
import createBrowserHistory from 'history/createBrowserHistory'
import '@/assets/less/common.less'

const app = dva({
  history: createBrowserHistory()
})

app.use(createLoading({
  effect: true
}))

app.model(require('./app.js'))

const modules = require.context('./views', true, /model.js$/)
modules.keys().map(key => app.model(modules(key)))

app.router(require('./router.js'))
app.start('#app')

window.app = app
