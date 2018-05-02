import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'dva/dynamic' // eslint-disable-line
import { Route, Redirect, routerRedux, Switch, IndexRoute, Link } from 'dva/router' // eslint-disable-line
import AppLayout from '@/views/_layout/AppLayout'
import MENUS from './menu'

const { ConnectedRouter } = routerRedux

const PATHS = Object.keys(MENUS)

const Routers = function ({ history, app }) {
  return (
    <ConnectedRouter history={history} onUpdate={() => window.scrollTo(0, 0)}>
      <AppLayout>
        <Switch>
          { PATHS.map(path => (
            <Route key={path} path={`/${path}`} component={dynamic({
              app,
              component: () => import(/* webpackChunkName: "[request]" */`views/${path}/index`)
            })} />
          ))
          }
          <Route render={() => <Redirect to="/home" />} />
        </Switch>
      </AppLayout>
    </ConnectedRouter>
  )
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object
}

export default Routers
