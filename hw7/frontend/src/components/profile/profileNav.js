import React from 'react'
import { connect } from 'react-redux'
import { navToMain } from '../../actions'
import { logout } from '../auth/authActions'

const ProfileNav = ({dispatch}) => (
    <div>
        <button className="btn" id="logoutBtn" onClick={() => { dispatch(logout()) }}>Log Out</button>
        <button className="btn" id="profileBtn" onClick={() => { dispatch(navToMain()) }}>Main Page</button>
    </div>
)

export default connect()(ProfileNav)