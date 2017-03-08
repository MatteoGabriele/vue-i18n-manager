import events from './store/module/events'
import { isBrowser } from './utils'

/**
 * Includes language in the route
 * @param  {Object} route
 * @return {Object}
 */
export const localize = (route, urlPrefix) => {
  let originalRouteParams = route.params || {}

  // see https://github.com/MatteoGabriele/vue-i18n-manager/issues/12
  let routeCopy = { ...route }
  const path = routeCopy.path

  delete routeCopy.path

  return Object.assign({}, routeCopy, {
    path,
    params: {
      ...originalRouteParams,
      lang: urlPrefix
    }
  })
}

/**
 * Update URL prefix
 * @param  {VueRouter} router
 * @param  {String} urlPrefix
 */
export const updateURLPrefix = (router, urlPrefix) => {
  const { currentRoute } = router

  if (router && currentRoute) {
    router.replace(localize(currentRoute, urlPrefix))
  }
}

const detectedURLPrefixExists = (urlPrefix, languages) => {
  return languages.find(n => n.urlPrefix === urlPrefix)
}

/**
 * Get the language from the location object
 * @return {String}
 */
export const getUrlPrefix = function () {
  if (!isBrowser) {
    return
  }

  const { pathname } = window.location

  return pathname.split('/')[1]
}

/**
 * Applies specific functionalities to handle language redirects and URL prefixing.
 * The application will be able to add the language urlPrefix property in its URL and
 * change the application language based on that specific parameter.
 * If that prefix is not valid or it doesn't exist, the application will fallback
 * to the default language.
 * VueRouter instance is required to unlock this feature.
 * @param  {VueRouter} router
 * @param  {VuexStore} store
 */
export const registerRouter = (router, store) => {
  if (!router) {
    return
  }

  // check if there's a language in the route params or get it from the url
  const currentUrlPrefix = router.currentRoute.params.lang || getUrlPrefix()
  // check if the current url prefix exists in the language list
  const detectedURLPrefix = detectedURLPrefixExists(currentUrlPrefix, store.getters.languages)

  if (detectedURLPrefix) {
    // Set the detected language as the new language
    store.dispatch(events.SET_LANGUAGE, detectedURLPrefix.urlPrefix)
  } else {
    // First time the router is registered, or the language doesn't exists,
    // the route needs to be synced with the current language.
    updateURLPrefix(router, store.getters.defaultCode)
  }

  router.beforeEach((to, from, next) => {
    const { availableLanguages, currentLanguage, forceTranslation, languages } = store.getters
    const urlPrefix = to.params.lang
    const languageList = forceTranslation ? languages : availableLanguages
    const urlLanguage = languageList.find(n => n.urlPrefix === urlPrefix)

    // In case the language is not provided or doesn't exists,
    // the default language will be used.
    // This will only be fired on landing, because most of the time
    // the URL doesn't contain a language prefix or the user typed
    // a different language on purpose and we need to check it.
    if (!urlLanguage || !from.name) {
      return next(localize(to, currentLanguage.urlPrefix))
    }

    // Check if the detected language in the URL is also the current
    // translated language, otherwise it needs to be updated.
    // Browser language has prioriry over the store state
    const isDiff = urlLanguage && urlLanguage.urlPrefix !== currentLanguage.urlPrefix

    if (isDiff) {
      // Resolve the router hook after the new language is set
      return store.dispatch(events.SET_LANGUAGE, urlLanguage.code).then(() => next())
    }

    next()
  })
}

/**
 * Route parser takes the current routes object before is injected in the VueRouter instance
 * and it returns the necessary tree structure to enable language prefixing
 * @param  {Array<Object>} routes
 * @param  {String} [defaultCode='en'] - language redirect
 * @return {Array<Object>}
 */
export const routeParser = (routes, defaultCode = 'en') => {
  routes.forEach(route => {
    const { path } = route
    route.path = `/:lang${path}`
  })

  return [
    ...routes,
    {
      path: '/*',
      redirect: {
        path: `/${defaultCode}`
      }
    }
  ]
}

export default function (Vue, router, store) {
  Vue.prototype.$localize = (route) => {
    return localize(route, store.getters.currentLanguage.urlPrefix)
  }
}
