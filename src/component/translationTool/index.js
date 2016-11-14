import template from './index.html'
import { log } from '../../utils'
import { SET_FORCE_TRANSLATION } from '../../store/module/events'
import './index.scss'

export default {
  name: 'translation-tool',

  props: {
    /**
     * Name of the property needs to be displayed in the language list
     */
    label: {
      type: String,
      default: 'name'
    },

    /**
     * Enable it to click & close the translation-tool directly
     * everytime a language is selected for testing
     */
    closeOnClick: {
      type: Boolean,
      default: false
    }
  },

  template,

  beforeDestroy () {
    if (!this.visibility) {
      return
    }

    this.$store.dispatch(SET_FORCE_TRANSLATION, false)
  },

  data () {
    return {
      visibility: false,
      buttonEnabled: true
    }
  },

  computed: {
    isDisabled () {
      return !this.buttonEnabled && this.closeOnClick
    },
    languages () {
      return this.$store.getters.languages
    }
  },

  methods: {
    setLanguage (code) {
      this.buttonEnabled = false

      this.$setLanguage(code).then(() => {
        if (this.closeOnClick) {
          this.visibility = false
        }

        this.buttonEnabled = true
      })
    },
    getLabel (language) {
      const label = language[this.label]

      if (!label) {
        log(`"${this.label}" doesn't exist in the language with code "${language.code}"`, 'warn')
        return language.code
      }

      return label
    },
    isActive (code) {
      return this.$store.getters.currentLanguage.code === code
    },
    toggle () {
      this.visibility = !this.visibility
      this.$store.dispatch(SET_FORCE_TRANSLATION, this.visibility)
    }
  }
}
