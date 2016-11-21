import translationTool from './translationTool'
import languageSwitcher from './languageSwitcher'

export default function (Vue) {
  return {
    'translation-tool': translationTool(Vue),
    'language-switcher': languageSwitcher(Vue)
  }
}
