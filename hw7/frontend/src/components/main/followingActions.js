import Promise from 'bluebird'
import Action, { resource, updateError } from '../../actions'



export function removeFollower(uid) {
	return (dispatch) => {
		resource('DELETE', 'following/' + uid).then((response) => {
			dispatch({type: Action.DELETE_FOLLOWER, username: uid})
		})
	}
}

export function addFollower(uid) {
	return (dispatch) => {
		resource('PUT', 'following/' + uid).then((response) => {
			// check whether the added user exists or not
			if (response.following.indexOf(uid) === -1){
				dispatch(updateError(`The user ${uid} that you added does not exist.`))
			}
			else{
				const newFollower = { name: uid }
				const newFollowerHeadline = resource('GET','headlines'+'/'+uid)
				.then((headlineResponse) => {
					newFollower['headline'] = headlineResponse.headlines[0].headline
				})
				const newFollowerAvatar = resource('GET','avatars'+'/'+uid)
				.then((avatarResponse) => {
					newFollower['avatar'] = avatarResponse.avatars[0].avatar
				})
				// wait till headline and avatar response back
				Promise.all([newFollowerHeadline, newFollowerAvatar]).then(()=>{
					dispatch({type: Action.ADD_FOLLOWER, newFollower: newFollower})
				})
			}
		})
	}
}

export function fetchFollowers() {
    return (dispatch) => {
        resource('GET', 'following').then((response)=>{
			const followers = response.following.reduce((object, item)=>{object[item] = {name: item}; return object},{})
			
			const followersStr = response.following.join(',')

			const followersHeadline = resource('GET','headlines'+'/'+followersStr)
			.then((headlineResponse) => {
				headlineResponse.headlines.forEach((item) =>{
					followers[item.username].headline = item.headline;
				})
			})
			
			const followersAvatar = resource('GET','avatars'+'/'+followersStr)
			.then((avatarResponse) => {
				avatarResponse.avatars.forEach((item) =>{
					followers[item.username].avatar = item.avatar;
				})
			})

			Promise.all([followersHeadline, followersAvatar]).then(()=>{
				dispatch({type:Action.UPDATE_FOLLOWERS, followers})
			})
		})
    }
}



/** WEBPACK FOOTER **
 ** ./src/components/main/followingActions.js
 **/