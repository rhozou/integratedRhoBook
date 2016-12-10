import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import ProfileForm from './ProfileForm'
import ProfileAvatar from './profileAvatar'


const ProfileData = ({username, avatar, email, zipcode, dob}) => (
        <div>
            
            <ProfileAvatar avatar={avatar}/>

            <div className="row">
                <div className="col-md-6">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th><h3>Current Info</h3></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Display Name: <span className="spanValue" id="displayNameValue">{username}</span></td>
                            </tr>
                            <tr>
                                <td>Email: <span className="spanValue" id="emailValue">{email}</span></td>
                            </tr>
                            <tr>
                                <td>Date of Birth: <span className="spanValue">{moment(new Date(dob)).format('MM-DD-YYYY')}</span></td>
                            </tr>
                            <tr>
                                <td>Zipcode: <span id="zipcodeValue" className="spanValue">{zipcode}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <ProfileForm/>
            </div>
        </div>
)

ProfileData.propTypes = {
	username: PropTypes.string.isRequired,
	avatar: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
    zipcode: PropTypes.string.isRequired,
	dob: PropTypes.string.isRequired
}

export default connect(
    (state) => {
        return {
            username: state.profile.username,
            avatar: state.profile.avatar,
            email: state.profile.email,
            zipcode: state.profile.zipcode,
            dob: state.profile.dob
        }
    }
)(ProfileData)



/** WEBPACK FOOTER **
 ** ./src/components/profile/avatar.js
 **/