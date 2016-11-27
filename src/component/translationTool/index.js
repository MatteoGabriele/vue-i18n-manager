import template from './index.html'
import { warn, mapGetters } from '../../utils'
import events from '../../store/module/events'
import './index.scss'

export default function (Vue) {
  return {
    template,

    props: {
      /**
       * Remove css style to customize the component more easily
       */
      applyStyle: {
        type: Boolean,
        default: true
      },

      /**
       * Name of the property needs to be displayed in the language list.
       * It needs to match one of the property of the "language" object or
       * will fallback to the "code" property
       */
      label: {
        type: String,
        default: 'code'
      },

      /**
       * Enable it to click & close the translation-tool
       * everytime a language is selected for testing
       */
      closeOnClick: {
        type: Boolean,
        default: false
      }
    },

    mounted () {
      this.$store.dispatch(events.SET_FORCE_TRANSLATION, true)
    },

    beforeDestroy () {
      this.$store.dispatch(events.SET_FORCE_TRANSLATION, false)
    },

    data () {
      return {
        isOpen: false,
        buttonEnabled: true,
        selected: null
      }
    },

    computed: {
      ...mapGetters([
        'currentLanguage',
        'languageFilter',
        'languages'
      ]),
      isDisabled () {
        return !this.buttonEnabled && this.closeOnClick
      },

      isForced () {
        if (!this.selected) {
          return
        }

        return this.languageFilter.indexOf(this.selected) === -1
      }
    },

    watch: {
      currentLanguage (value) {
        if (!value) {
          return
        }

        this.selected = value.code
      }
    },

    methods: {
      close () {
        this.isOpen = false
      },

      setLanguage (code) {
        this.buttonEnabled = false

        this.$setLanguage(code).then(() => {
          if (this.closeOnClick) {
            this.isOpen = false
          }

          this.buttonEnabled = true
        })
      },

      getLabel (language) {
        const label = language[this.label]

        if (!label) {
          warn(`Label "${this.label}" doesn't exist in the language with code "${language.code}"`)
          return language.code
        }

        return label
      },

      isActive (code) {
        return this.currentLanguage.code === code
      },

      isVisible (code) {
        return this.currentLanguage.code === code || this.isOpen
      },

      toggle () {
        this.isOpen = !this.isOpen
      }
    }
  }
}
