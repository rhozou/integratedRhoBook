import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import ProfileNav from './profileNav'
import ProfileData from './profileData'


const Profile = () => {
    return (

        <div class="container">
            <div class="row">
                <div class="col-md-8 col-md-offset-2 text">
                    <h1><strong>Welcome to OwlBook!</strong></h1>
                    
                    <p>
                        <h5>A place where you can connect anybody from Rice campus</h5>
                    </p>
                    
                </div>
            </div>

            <ProfileNav/>
            <ProfileData/>
        </div>
    )
}
export default Profile



/** WEBPACK FOOTER **
 ** ./src/components/profile/profile.js
 **/