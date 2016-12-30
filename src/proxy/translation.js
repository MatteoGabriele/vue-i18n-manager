import { warn } from '../utils'

/**
 * Retrieves the current language translation
 * @param  {Object}  language
 * @param  {Object}  state
 * @return {Promise}
 */
export const getTranslation = async (state, language) => {
  const requestURL = `${state.path}/${language.translateTo}.json`

  const request = new Request(requestURL, {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })

  const response = await fetch(request, { credentials: 'same-origin' })

  if (!response.ok) {
    if (response.status === 404) {
      warn('Translation error. Check if the file exists and the url is correct')
    } else {
      warn(`${response.statusText} for ${requestURL}`)
    }

    return {}
  }

  return await response.json()
}
