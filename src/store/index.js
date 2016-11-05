import module from './module'

let store
let name = 'i18n'

export const dispatch = (event, payload) => {
  if (!store) {
    return
  }

  store.dispatch(event, payload)
}

export const initializeStore = (_store) => {
  store = _store
  store.registerModule(name, module)
}

export default store
