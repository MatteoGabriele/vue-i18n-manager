

# vue-i18n-manager [![Build Status](https://travis-ci.org/MatteoGabriele/vue-i18n-manager.svg?branch=master)](https://travis-ci.org/MatteoGabriele/vue-i18n-manager)
It will help you dealing with multi-language application using [vue-18n](https://github.com/kazupon/vue-i18n) plugin.
>**Vue 2.0 and Vuex are required**


## How to install it
```bash
npm install vue-i18n-manager
```

## How to use it
You only need to install the plugin, pass your VuexStore instance in the options object and you're good to go!
The plugin already installs the **vue-i18n**, so you don't need to!
```js
import Vue from 'vue'
import VueI18nManager from 'vue-i18n-manager'
import store from './store' // import your VuexStore instance

Vue.use(VueI18nManager, { store })

// Initialize the plugin using the init method of the Vue.$i18n class
Vue.$i18n.init().then(() => {
    new Vue(App).$mount('#app')
})
```


## Switch language
Is possible to use the built-in **$setLanguage** method directly in the HTML, passing the language code
```html
<button v-for="language in languages" @click="$setLanguage(language.code)">{{ language.name }}</button>
```
or use it programmatically, taking advantage of the Promise that the method returns, which is resolved when the new language is applied.
```js
{
  methods: {
    setLanguage (code) {
      this.$setLanguage(code).then(() => {
        // some logic
      })
    }
  }
}
```

## Page transitions
The language needs to be defined as a parameter of the route, to avoid typing it everytime, which you can still do using the **langUrlPrefix** computed value in the VuexStore getters, is possible to wrap the route object in the **$localize** method like so
```js
<router-link :to="$localize({ name: 'home' })"></router-link>
```
which will be parsed to
```js
<router-link :to="{ name: 'home', params: { lang: 'en-gb' } })"></router-link>
```


## Routing
Is not mandatory, but is possible to add the VueRouter instance passing a **router** object, to let the plugin handle language behaviors in the URL
```js
// router.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import { routeParser } from 'vue-i18n-manager'

Vue.use(VueRouter)

const routes = routeParser(
  [
    {
      name: 'home',
      path: '',
      component: ...
    }
  ]
)

const router = new Router({
  routes
})

export default router
```
```js
// bootstrap.js

import Vue from 'vue'
import VueI18nManager from 'vue-i18n-manager'
import store from './store' // import your VuexStore instance
import router from './router' // import your VueRouter instance

Vue.use(VueI18nManager, { store, router })
```

## Options

#### Configurations
Is possible also to pass a **config** object in the options object, which will merge existing values in the default state of the store module.
Is not possible to add properties, only the following are allowed:
* **languages**
* **availableLanguages**
* **persistent**
* **storageKey**
* **path**
* **defaultCode**
```js
import Vue from 'vue'
import VueI18nManager from 'vue-i18n-manager'
import store from './store' // import your VuexStore instance

// This configuration is already in the default state
// It's just an example of what is possible to modify before the application boots
const config = {
    languages: [
      {
        code: 'en-GB',
        urlPrefix: 'en-gb',
        translateTo: 'en-GB'
      }
    ],
    availableLanguages: [],
    persistent: true,
    storageKey: 'language_key',
    path: 'static/i18n',
    defaultCode: 'en-GB'
}

Vue.use(VueI18nManager, { store, config })
```

##### languages
Is possible to add languages passing them as an array in the **languages** property. The basic mandatory shape of a language item needs to have a **code**, **urlPrefix** and a **translateTo** property
```js
{
    code: 'en-GB',
    urlPrefix: 'en-gb',
    translateTo: 'en-GB'
}
```
* **code** is what allows the plugin to have a unique key in the languages array
* **urlPrefix** is displayed in the URL.
* **translateTo** is the actual translation that will be applied with this language and needs to match the actual .json file for the translation

##### availableLanguages
It is also possible to filter all languages passing an array of codes in the availableLanguages array like so
```js
const config = {
    languages: [
      {
        name: 'English',
        code: 'en-GB',
        urlPrefix: 'en',
        translateTo: 'en-GB'
      },
      {
        name: 'Nederlands',
        code: 'nl-NL',
        urlPrefix: 'nl',
        translateTo: 'nl-NL'
      },
      {
        name: 'Italiano',
        code: 'it-IT',
        urlPrefix: 'it',
        translateTo: 'it-IT'
      }
    ],
    availableLanguages: ['nl-NL', 'it-IT']
}
```
In this case only Dutch and Italian will be available by the application.

##### persistent
The plugin also stores the current selected language in the browser memory as default, but it is possible to turn it off
```js
const config = {
    persistent: false
}
```

##### storageKey
Is possible to selected another name for the browser storage item. Default is **language_key**

##### path
This is the path for the .json file that holds the translations. Default is **static/i18n**

##### defaultCode
The defaultCode is the code of the language that will be displayed in case of a not matched language in the URL or in case the URL doesn't have any language prefix at all.
>**The default code needs to match at least one item in the languages array**

## Getters
List of available getters that come with the module.

* languages
* currentLanguage
* langUrlPrefix
* defaultCode

```js
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters([
            'currentLanguage'
        ])
    }
}
```
