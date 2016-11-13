import VueI18n from 'vue-i18n'
import merge from 'lodash/merge'
import find from 'lodash/find'
import components from './components'
import { UPDATE_I18N_STATE, SET_LANGUAGE } from './store/module/events'
import module from './store/module'
import { log } from './utils'

class I18n {
  constructor (Vue, { store, router, config }) {
    if (!store) {
      log('You need to add the VuexStore instance in the plugin options', 'error')
      return
    }

    this.$vue = Vue
    this.$store = store
    this.$config = config
    this.$router = router
  }

  /**
   * Applies specific functionalities to handle language redirects and URL prefixing.
   * The application will be able to add the language urlPrefix property in its URL and
   * to change the application language based on that specific parameter.
   * If that urlPrefix provided via URL is not valid or it doesn't exist the application
   * will fallback to the default language.
   * VueRouter instance is required to unlock this feature.
   */
  registerRouter () {
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
        return this.setLanguage(urlLanguage.code, false).then(() => next())
      }

      next()
    })
  }

  /**
   * Includes the lang param in the route object
   * @param  {Object} link
   * @return {Object}
   */
  localizeRoute (route) {
    const { currentLanguage } = this.$store.getters

    return merge(route, {
      params: {
        lang: currentLanguage.urlPrefix
      }
    })
  }

  /**
   * Register the current module to the application store
   * when the plugin is initliazed
   */
  registerModule () {
    this.$store.registerModule('i18n', module)
  }

  /**
   * Update plugin state.
   * Updates the module default state merging it with the plugin config options
   */
  async updatePluginState () {
    await this.$store.dispatch(UPDATE_I18N_STATE, this.$config)
  }

  /**
   * Set language
   * It sets the new requested language, replaces the url prefix in the url
   * and returns translations which are then applyed using vue-i18n.
   * If no language is passed, the language will be the one choosen as default
   * @param {String} [code=defaultCode]
   * @param {Boolean} [replaceRoute=true]
   * @return {Promise}
   */
  async setLanguage (code = this.$store.getters.defaultCode, replaceRoute = true) {
    const translations = await this.$store.dispatch(SET_LANGUAGE, code)
    const { currentRoute } = this.$router

    // Set vue-i18n locale configuration
    this.$vue.locale(code, translations, () => {
      this.$vue.config.lang = code
    })

    // Modify the URL with the new language
    if (replaceRoute && (this.$router && currentRoute)) {
      this.$router.replace({
        name: currentRoute.name,
        params: {
          lang: this.$store.getters.langUrlPrefix
        }
      })
    }
  }

  /**
   * Initialize the plugin mutations
   */
  async init () {
    // Register the i18n module to the application store
    this.registerModule()

    // Merge configuration from the plugin options with the module default state
    await this.updatePluginState()

    // Set the current language and translations
    await this.setLanguage()

    // Start managing routes
    this.registerRouter()
  }
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

export const languageTester = components.languageTester

/**
 * Expose the install function to let Vue install the pm plugin
 * @param  {Vue instance} Vue
 * @param  {Object} [options={}]
 */
export default function install (Vue, options = {}) {
  const instance = new I18n(Vue, options)

  // Check if vue-i18n is not installed
  if (!Vue.config.lang) {
    Vue.use(VueI18n)
  }

  Vue.$i18n = instance

  Vue.prototype.$localize = instance.localizeRoute.bind(instance)
  Vue.prototype.$setLanguage = instance.setLanguage.bind(instance)
}
