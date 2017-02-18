/**
 * Retrieves the current language translation
 * @param  {Object}  language
 * @param  {Object}  state
 * @return {Promise}
 */
export const getTranslation = (state, language) => {
  return new Promise((resolve) => {
    resolve({
      message: 'hello'
    })
  })
}
