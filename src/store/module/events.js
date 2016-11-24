/**
 * Plugin namespace for events
 */
import { name } from './../../../package.json'

export const REMOVE_LANGUAGE_PERSISTENCY = `${name}/REMOVE_LANGUAGE_PERSISTENCY`
export const UPDATE_I18N_CONFIG = `${name}/UPDATE_CONFIG`
export const SET_LANGUAGE = `${name}/SET_LANGUAGE`
export const SET_TRANSLATION = `${name}/SET_TRANSLATION`
export const GET_TRANSLATION = `${name}/GET_TRANSLATION`
export const SET_FORCE_TRANSLATION = `${name}/SET_FORCE_TRANSLATION`
