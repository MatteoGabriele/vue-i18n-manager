import find from 'lodash/find'
import merge from 'lodash/merge'

import { SET_LANGUAGE } from './store/module/events'
import localeHandler from './locale'

let instance

class RouterHandler {
  constructor (Vue, router, store) {
    this.$router = router
    this.$store = store
    this.$vue = Vue

    this.$localeHandler = localeHandler(Vue)
  }

  /**
   * Applies specific functionalities to handle language redirects and URL prefixing.
   * The application will be able to add the language urlPrefix property in its URL and
   * to change the application language based on that specific parameter.
   * If that urlPrefix provided via URL is not valid or it doesn't exist the application
   * will fallback to the default language.
   * VueRouter instance is required to unlock this feature.
   */
  register () {
    if (!this.$router) {
      return
    }

    this.$router.beforeEach((to, from, next) => {
      const { availableLanguages, currentLanguage, defaultCode } = this.$store.getters
      const urlCode = to.params.lang
      const urlLanguage = find(availableLanguages, { urlPrefix: urlCode })

      /**
       * In case the language is not provided or doesn't exists,
       * the default language will be used.
       * This will only be fired on landing, because most of the time
       * the URL doesn't contain a language prefix or the user typed
       * a different language on purpose and we need to check it.
       */
      if (!urlLanguage && (!from.name || urlCode)) {
        const { urlPrefix } = find(availableLanguages, { code: defaultCode })

        return next({
          name: to.name,
          params: {
            lang: urlPrefix
          }
        })
      }

      /**
       * Check if the detected language in the URL is also the current
       * translated language, otherwise it needs to be updated.
       * Browser language has prioriry over the store state
       */
      if (urlLanguage && urlLanguage.urlPrefix !== currentLanguage.urlPrefix) {
        return this.$store.dispatch(SET_LANGUAGE, urlLanguage.code).then((translations) => {
          this.$localeHandler.update(urlLanguage.code, translations)
          next()
        })
      }

      next()
    })
  }

  /**
   * Includes the lang param in the route object
   * @param  {Object} link
   * @return {Object}
   */
  localize (route) {
    const { currentLanguage } = this.$store.getters

    return merge(route, {
      params: {
        lang: currentLanguage.urlPrefix
      }
    })
  }

  updateURL () {
    const { currentRoute } = this.$router

    if (this.$router && currentRoute) {
      this.$router.replace({
        name: currentRoute.name,
        params: {
          lang: this.$store.getters.langUrlPrefix
        }
      })
    }
  }
}

export default function (Vue, router, store) {
  if (!instance) {
    instance = new RouterHandler(Vue, router, store)
  }

  Vue.prototype.$localize = instance.localize.bind(instance)

  return instance
}

/**
 * Route parser takes the current routes object before is injected in the VueRouter instance
 * and it returns the necessary tree structure to enable language prefixing
 * @param  {Array} routes
 * @return {Array}
 */
export const routeParser = (routes) => {
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
      redirect: '/en'
    }
  ]
}
