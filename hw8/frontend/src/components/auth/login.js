import React from 'react'
import { connect } from 'react-redux'

import { localLogin } from './authActions'

const Login = ({dispatch}) => {
    let username, password
    return (
        <form role="form" id="loginForm">
            <div className="form-group">
                <label className="sr-only">Username</label>
                <input type="text" name="username" placeholder="Username..." className="form-control" id="username" 
                ref={(node) => { username = node }} required />
            </div>
            <div className="form-group">
                <label className="sr-only">Password</label>
                <input type="password" name="password" placeholder="Password..." className="form-control" id="password" 
                ref={(node) => { password = node }}required />
            </div>
            <input className="btn btn-primary" id="loginBtn" type="button" value="Login!"
             onClick={() => { dispatch(localLogin(username.value, password.value)) }}/>
        </form>
    )
}

export default connect()(Login)


