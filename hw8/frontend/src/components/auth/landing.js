import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Login from './login'
import Register from './register'

let Message = ({error, success}) => (
    <div className="row">
        <div className="card">
            { error.length == 0 ? '' :
                <h3 id="message"> {error} </h3>
            }

            { success.length == 0 ? '' :
                <h3 id="message"> {success} </h3>
            }
        </div>
    </div>
)

Message.propTypes = {
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired
}

Message = connect((state) => {
    return { error: state.common.error, success: state.common.success }
})(Message)

const Landing = () => (
    <div className="container">
            <div className="row">
                <div className="col-sm-8 col-sm-offset-2 text">
                    <h1><strong>Welcome to OwlBook!</strong></h1>
                    
                    
                    <h5>A place where you can connect anybody from Rice campus</h5>
                    
                    
                </div>
            </div>

            <div className="row">
                <div className="col-sm-5">

                    <div className="form-box">
                        <div className="form-top">
                            <div className="form-top-left">
                                <h3>Login</h3>
                                <p>Enter username and password to login:</p>
                            </div>
                        </div>
                        <div className="form-bottom">
                            <Login/>
                        </div>
                    </div>

                    <Message/>

                </div>

                <div className="col-sm-1"></div>
                <div className="col-sm-1"></div>

                <div className="col-sm-5">

                    <div className="form-box">
                        <div className="form-top">
                            <div className="form-top-left">
                                <h3>Sign up</h3>
                                <p>Seconds away to get access to OwlBook:</p>
                            </div>
                        </div>
                        <div className="form-bottom">
                            <Register/>
                        </div>
                    </div>

                </div>
            </div>
        </div>
)

export default Landing



/** WEBPACK FOOTER **
 ** ./src/components/auth/landing.js
 **/