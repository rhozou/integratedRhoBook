import React from 'react'
import { connect } from 'react-redux'
import { navToProfile } from '../../actions'
import { logout } from '../auth/authActions'

const Nav = ({dispatch}) => (
    <li>
        <button className="btn" id="logoutBtn" onClick={() => { dispatch(logout()) }}>Log Out</button>
        <button className="btn" id="profileBtn" onClick={() => { dispatch(navToProfile()) }}>Profile</button>
    </li>
)

export default connect()(Nav)



/** WEBPACK FOOTER **
 ** ./src/components/main/nav.js
 **/