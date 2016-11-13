import template from './index.html'
import { log } from '../../utils'
import { SET_FORCE_TRANSLATION } from '../../store/module/events'
import './index.scss'

export default {
  name: 'translation-tool',

  props: {
    label: {
      type: String,
      default: 'name'
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
      visibility: false
    }
  },

  computed: {
    languages () {
      return this.$store.getters.languages
    }
  },

  methods: {
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
