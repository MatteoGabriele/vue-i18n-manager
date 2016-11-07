# vue-i18n manager for Vue
It will help you dealing with multi-language application using [vue-18n](https://github.com/kazupon/vue-i18n) plugin.
>**Vue 2.0 and VuexStore are required**

## How to install it
```bash
npm install vue-i18n-manager
```

## How to use it
You only need to pass your VuexStore instance and you're good to go!
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

## How to switch language
```js
// Vue component
export default {
    methods: {
        setLanguage (code) {
            this.$i18n.setLanguage(code).then(() => {
                // The new language is set
            })
        }
    }
}
```

```html
<button v-for="language in languages" @click="setLanguage(language.code)">{{ language.name }}</button>
```

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

## Options
#### Navigation handler
Is not mandatory, but is possible to add the VueRouter instance passing a `router` object, to let the plugin handle language behaviors in the URL
```js
import Vue from 'vue'
import VueI18nManager from 'vue-i18n-manager'
import store from './store' // import your VuexStore instance
import router from './router' // import your VueRouter instance

Vue.use(VueI18nManager, { store, router })
```

#### Configurations
Is possible also to pass a `config` object in the options object, which will merge existing values in the default state of the store module.
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
Is possible to add languages passing them as an array in the `languages` property. The basic mandatory shape of a language item needs to have a `code`, `urlPrefix` and a `translateTo` property
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
