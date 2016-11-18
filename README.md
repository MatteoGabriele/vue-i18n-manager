[![Build Status](https://travis-ci.org/MatteoGabriele/vue-i18n-manager.svg?branch=master)](https://travis-ci.org/MatteoGabriele/vue-i18n-manager) [![npm version](https://badge.fury.io/js/vue-i18n-manager.svg)](https://badge.fury.io/js/vue-i18n-manager) [![npm](https://img.shields.io/npm/dt/vue-i18n-manager.svg)](https://www.npmjs.com/package/vue-i18n-manager)

# vue-i18n-manager
Helper plugin that would make your life easier dealing with multi-language application using [vue-18n](https://github.com/kazupon/vue-i18n) plugin
>**Vue 2.0 and Vuex are required**

## Features
- URL prefixing
- Language redirects
- Language translations with vue-i18n
- Language switcher function
- Localize method for your routes
- Routes parser helper to manage your route structure
- Possibility to add and filter languages
- A Translation Tool to manage all languages without changing filters or environment
- Vuex integration

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
The language needs to be defined as a parameter of the route, to avoid typing it every time, which you can still do using the **langUrlPrefix** computed value in the VuexStore getters, is possible to wrap the route object in the **$localize** method like so
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

## Translation Tool
The translation tool it's a component that force the application to handle all languages without any filters.
The application will still maintain the same logic and look & feel, but will be possible to check all other languages that we can't actually see because we are maybe restricting that via server.
The component will also show the current selected language and the language label will start fading in and out just to remember you that the language is forced by the tool.

```js
// my-component.js

import { translationTool } from 'vue-i18n-manager'

export default {
    components: {
        translationTool
    }
}
```

```html
// my-component.html

<translation-tool />   
```
The translation tool accept 3 attributes:
#### applyStyle
Set it to false to remove all style associated with the component. Default is true.

#### label
A the name of the property in the language object you want to show in the translation tool. Default is the `code`.

#### closeOnClick
Set to true and the tool will collapse every time a language is selected. Default is false.

## Options

#### Configurations
It's possible also to pass a **config** object in the options object, which will merge existing values in the default state of the store module.
Important to know is that the **config** object can be also a Promise which has to return a plain object with its properties.
Is not possible to add properties, only the following are allowed:
* **languages**
* **languageFilter**
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
    languageFilter: [],
    persistent: true,
    storageKey: 'language_key',
    path: 'static/i18n',
    defaultCode: 'en-GB'
}

Vue.use(VueI18nManager, { store, config })
```

##### languages
Is possible to add languages passing them as an array in the **languages** property. The basic mandatory shape of a language item needs to have a **code**, **urlPrefix** and a **translateTo** property, but then it can hold every kind of information you need to store.
```js
{
    name: 'English',
    currency: 'britich pound',
    code: 'en-GB',
    urlPrefix: 'en-gb',
    translateTo: 'en-GB'
}
```
* **code** is what allows the plugin to have a unique key in the languages array
* **urlPrefix** is displayed in the URL.
* **translateTo** is the actual translation that will be applied with this language and needs to match the actual .json file for the translation

##### languageFilter
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
    languageFilter: ['nl-NL', 'it-IT']
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
A list of all available getters

##### languages
Array of all languages. **_No filter applied_**

##### languageFilter
Array of filtered languages code.

##### availableLanguages
Array of all available languages which can be filtered via the _languageFilter_ property.

##### currentLanguage
The current selected language object

##### urlPrefix
The url prefix of the current language


##### forceTranslation
It returns a Boolean that checks if the application is in "force translation mode" due to the TranslationTool functionalities that allows us to view all languages without changing the current application logic.

##### defaultCode
The default language code of the application
