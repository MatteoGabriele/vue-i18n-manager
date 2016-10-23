import module from './module'

let _store

const storeManager = (store, name) => {
  if (!store) {
    return
  }

  _store = store
  _store.registerModule(name, module)
}

export const dispatch = (event, payload) => {
  if (!_store) {
    return
  }

  _store.dispatch(event, payload)
}

export default storeManager
