import find from 'lodash/find'
import merge from 'lodash/merge'
import each from 'lodash/each'

import events from './store/module/events'

/**
 * Includes language in the route
 * @param  {Object} route
 * @return {Object}
 */
export const localize = (route, urlPrefix) => {
  let originalRouteParams = route.params || {}

  /**
   * It's not possible to push/replace a route with the readonly property `path`
   * so it's necessary to copy the route in a new object first and then delete
   * the property
   */
  let routeCopy = { ...route }
  delete routeCopy.path

  return merge(routeCopy, {
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

/**
 * Applies specific functionalities to handle language redirects and URL prefixing.
 * The application will be able to add the language urlPrefix property in its URL and
 * change the application language based on that specific parameter.
 * If that prefix is not valid or it doesn't exist, the application will fallback
 * to the default language.
 * VueRouter instance is required to unlock this feature.
 */
export const registerRouter = (router, store) => {
  if (!router) {
    return
  }

  // First time the router is registered, the route needs to be synced with the current language
  updateURLPrefix(router, store.getters.currentLanguage.urlPrefix)

  router.beforeEach((to, from, next) => {
    const { availableLanguages, currentLanguage, forceTranslation, languages } = store.getters
    const urlPrefix = to.params.lang
    const languageList = forceTranslation ? languages : availableLanguages
    const urlLanguage = find(languageList, { urlPrefix })

    /**
     * In case the language is not provided or doesn't exists,
     * the default language will be used.
     * This will only be fired on landing, because most of the time
     * the URL doesn't contain a language prefix or the user typed
     * a different language on purpose and we need to check it.
     */
    if (!urlLanguage || !from.name) {
      return next(localize(to, currentLanguage.urlPrefix))
    }

    /**
     * Check if the detected language in the URL is also the current
     * translated language, otherwise it needs to be updated.
     * Browser language has prioriry over the store state
     */
    const isDiff = urlLanguage && urlLanguage.urlPrefix !== currentLanguage.urlPrefix

    if (isDiff) {
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
  each(routes, route => {
    const { path } = route
    route.path = `/:lang${path}`
  })

  return [
    ...routes,
    {
      path: '/*',
      name: 'redirect',
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
