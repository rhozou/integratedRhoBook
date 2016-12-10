import Action, { updateError, resource } from '../../actions'

export function uploadAvatar(file) {
    return (dispatch) => {
        // for form data upload set the flag to false since it is not jason type
        const fd = new FormData()
        fd.append('image', file)
        resource('PUT', 'avatar', fd, false).then((response) => {
            dispatch({type: Action.UPDATE_AVATAR, avatar: response.avatar})
        })
    }
}


export function updateHeadline(headline) {
    return (dispatch) => {
        if (headline) {
            const payload = {}
            payload['headline'] = headline
            resource('PUT', 'headline', payload).then((response) => {
                dispatch({ type: Action.UPDATE_HEADLINE, headline: response.headline})
            })
        }
    }
}

export function updateUserProfile(email, zipcode, password) {
    return (dispatch) => {
        dispatch(updateEmail(email))
        dispatch(updateZipcode(zipcode))
        dispatch(updatePassword(password))
    }
}

export function updatePassword(pwd) {
    return (dispatch) => {
        resource('PUT', 'password', {password: pwd}).then((response) => {
            // display message to show the password update request sent
            if (response.message === "will not change"){
                dispatch(updateError('Password update request sent.'))
            }
        })
    }
}

export function updateZipcode(zipcode) {
    return (dispatch) => {
        if (zipcode) {
            const payload = {}
            payload['zipcode'] = zipcode
            resource('PUT', 'zipcode', payload).then((response) => {
                dispatch({ type: Action.UPDATE_ZIPCODE, zipcode: response.zipcode})
            })
        }
    }
}

export function updateEmail(email) {
    return (dispatch) => {
        if (email) {
            const payload = {}
            payload['email'] = email
            resource('PUT', 'email', payload).then((response) => {
                dispatch({ type: Action.UPDATE_EMAIL, email: response.email})
            })
        }
    }
}


/** WEBPACK FOOTER **
 ** ./src/components/profile/profileActions.js
 **/