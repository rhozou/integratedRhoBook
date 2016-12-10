import Action, { resource, updateError, updateSuccess, navToMain, navToOut } from '../../actions'
import Promise from 'bluebird'
import { fetchFollowers } from '../main/followingActions'
import { fetchArticles } from '../article/articleActions'

export function initialVisit() {
    return (dispatch) => {
        resource('GET', 'headlines').then((response) => {
            dispatch(navToMain())
            dispatch({type: Action.UPDATE_HEADLINE,
                username: response.headlines[0].username,
                headline: response.headlines[0].headline
            })
            dispatch(fetchFollowers())
            dispatch(fetchArticles())
        })
    }
}

const fetchProfile = (username, dispatch) => {
    const action = { type: Action.UPDATE_PROFILE }

    const profileAvatar = resource('GET', 'avatars/'+username)
    .then((avatarResponse) => {
        action.avatar = avatarResponse.avatars[0].avatar
    })

    const profileEmail = resource('GET', 'email/'+username)
    .then((emailResponse) => {
        action.email = emailResponse.email
    })

    const profileZipcode = resource('GET', 'zipcode/'+username)
    .then((zipcodeResponse) => {
        action.zipcode = zipcodeResponse.zipcode
    })

    const profileDOB = resource('GET', 'dob')
    .then((dobResponse) => {
        action.dob = dobResponse.dob
    })

    // wait for all the responses then update the profile data
    Promise.all([profileAvatar, profileEmail, profileZipcode, profileDOB]).then(() => {
        dispatch(action)
    })
}

export function localLogin(username, password) {
    return (dispatch) => {
        resource('POST', 'login', { username, password })
        .then((response) => {
            dispatch({type: Action.LOGIN_LOCAL, username: response.username})
            dispatch(initialVisit())
            fetchProfile(username, dispatch)
        }).catch((err) => {
            dispatch(updateError(`There was an error logging in as ${username}`))
        })
    }
}

export function register(uname, email, dob, zipcode, password) {
    return (dispatch) => {
        resource('POST', 'register', { username: uname, email: email, dob: dob, zipcode: zipcode, 
            password: password})
        .then((response) => {
            dispatch(updateSuccess(`You successfully registered as ${uname}`))
        }).catch((err) => {
            dispatch(updateError(`There was an error register as ${uname}`))
        })
    }
}


export function logout() {
    return (dispatch) => {
        resource('PUT', 'logout')
        .catch((err) => {
            dispatch({type: Action.LOGIN_LOCAL, username: undefined})
            dispatch(navToOut())
        })
    }
}



