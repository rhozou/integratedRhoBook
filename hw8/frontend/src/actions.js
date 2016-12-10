import Promise from 'bluebird'
import fetch from 'isomorphic-fetch'
//export const apiUrl = 'https://fast-ridge-31816.herokuapp.com'
export const apiUrl = 'http://127.0.0.1:3000'
const Action = {

     ADD_ARTICLE: 'ADD_ARTICLE'
    ,UPDATE_SINGLE_ARTICLE: 'UPDATE_SINGLE_ARTICLE'
    ,UPDATE_ARTICLES: 'UPDATE_ARTICLES'
    ,EDIT_ARTICLE: 'EDIT_ARTICLE'
    ,SEARCH_KEYWORD: 'SEARCH_KEYWORD'
    ,UPDATE_AVATARS: 'UPDATE_AVATARS'

    ,UPDATE_FOLLOWERS: 'UPDATE_FOLLOWERS'
    ,ADD_FOLLOWER: 'ADD_FOLLOWER'
    ,DELETE_FOLLOWER: 'DELETE_FOLLOWER'
    ,UPDATE_HEADLINE: 'UPDATE_HEADLINE'
    ,UPDATE_EMAIL: 'UPDATE_EMAIL'
    ,UPDATE_ZIPCODE: 'UPDATE_ZIPCODE'
    ,UPDATE_PROFILE: 'UPDATE_PROFILE'
    ,UPDATE_AVATAR: 'UPDATE_AVATAR'

    ,ERROR: 'ERROR'
    ,SUCCESS: 'SUCCESS'

    ,NAV_PROFILE: 'NAV_PROFILE'
    ,NAV_MAIN: 'NAV_MAIN'
    ,NAV_OUT: 'NAV_OUT'

    ,LOGIN_LOCAL: 'LOGIN_LOCAL'
    ,REGISTER_USER: 'REGISTER_USER'

}

export default Action

export function updateError(error) { return { type: Action.ERROR, error }}
export function updateSuccess(success) { return { type: Action.SUCCESS, success }}
export function navToProfile() { return { type: Action.NAV_PROFILE }}
export function navToMain() { return { type: Action.NAV_MAIN }}
export function navToOut() { return { type: Action.NAV_OUT }}

export function resource(method, endpoint, payload, submitJson = true) {
    const options = {credentials: 'include', method}
    if (submitJson) options.headers = {'Content-Type': 'application/json'}
    if (payload) {
        options.body = submitJson ? JSON.stringify(payload) : payload
    }

    return fetch(`${apiUrl}/${endpoint}`, options)
    .then((response) => {
        if (response.status == 401) {
            const message = `Error in ${method} ${endpoint} ${JSON.stringify(response.json())}`
            throw new Error(message)
        } else {
            return response.json()
        }
    })
}



/** WEBPACK FOOTER **
 ** ./src/actions.js
 **/