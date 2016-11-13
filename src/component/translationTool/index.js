import template from './index.html'
import { SET_FORCE_TRANSLATION } from '../../store/module/events'
import './index.scss'

export default {
  name: 'translation-tool',

  template,

  mounted () {
    this.$store.dispatch(SET_FORCE_TRANSLATION, true)
  },

  beforeDestroy () {
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
    isActive (code) {
      return this.$store.getters.currentLanguage.code === code
    },
    toggle () {
      this.visibility = !this.visibility
    }
  }
}
