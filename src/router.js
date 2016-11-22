import find from 'lodash/find'
import merge from 'lodash/merge'

import { SET_LANGUAGE } from './store/module/events'

/**
 * Includes language in the route
 * @param  {Object} route
 * @return {Object}
 */
const localize = (route, urlPrefix) => {
  return merge(route, {
    params: {
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
    router.replace(localize({ name: currentRoute.name }, urlPrefix))
  }
}

/**
 * Applies specific functionalities to handle language redirects and URL prefixing.
 * The application will be able to add the language urlPrefix property in its URL and
 * to change the application language based on that specific parameter.
 * If that urlPrefix provided via URL is not valid or it doesn't exist the application
 * will fallback to the default language.
 * VueRouter instance is required to unlock this feature.
 */
const registerRouter = (router, store) => {
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
      return next(localize({ name: to.name }, currentLanguage.urlPrefix))
    }

    /**
     * Check if the detected language in the URL is also the current
     * translated language, otherwise it needs to be updated.
     * Browser language has prioriry over the store state
     */
    const isDiff = urlLanguage && urlLanguage.urlPrefix !== currentLanguage.urlPrefix

    if (isDiff) {
      return store.dispatch(SET_LANGUAGE, urlLanguage.code).then(() => next())
    }

    next()
  })
}

/**
 * Route parser takes the current routes object before is injected in the VueRouter instance
 * and it returns the necessary tree structure to enable language prefixing
 * @param  {Array} routes
 * @param  {String} [defaultCode='en'] - language redirect
 * @return {Array}
 */
export const routeParser = (routes, defaultCode = 'en') => {
  return [
    {
      path: '/:lang',
      name: 'root',
      component: {
        template: '<router-view></router-view>'
      },
      children: routes
    },
    {
      path: '/*',
      name: 'redirect',
      redirect: {
        name: 'root',
        params: {
          lang: defaultCode
        }
      }
    }
  ]
}

export default function (Vue, router, store) {
  registerRouter(router, store)

  Vue.prototype.$localize = (route) => {
    return localize(route, store.getters.currentLanguage.urlPrefix)
  }
}
