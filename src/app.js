export default {
  namespace: 'App',
  state: {

  },
  reducers: {
    update (state, {type, ...payload}) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {

  },
  subscriptions: {
    setup ({dispatch, history}) {

    }
  }
}
