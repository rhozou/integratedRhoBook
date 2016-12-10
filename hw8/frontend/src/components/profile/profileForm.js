import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateUserProfile } from './profileActions'

let Message = ({error, success}) => (
    <div className="card">
        { error.length == 0 ? '' :
            <h4 id="message"> {error} </h4>
        }

        { success.length == 0 ? '' :
            <h4 id="message"> {success} </h4>
        }
    </div>
)

Message.propTypes = {
    error: PropTypes.string.isRequired,
    success: PropTypes.string.isRequired
}

Message = connect((state) => {
    return { error: state.common.error, success: state.common.success }
})(Message)

class ProfileForm extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="col-md-6">
                    <div className="form-box" id="updateForm">
                        <div className="form-top">
                            <div className="form-top-left">
                                <h3>Update Info</h3>
                            </div>
                        </div>
                        <div className="form-bottom">
                            <form role="form" onSubmit={(e) => {
                                e.preventDefault()
                                this.props.dispatch(updateUserProfile(this.email.value, this.zipcode.value, this.password.value))
                            }}>
                    
                                <div className="form-group">
                                    <label className="sr-only">Email</label>
                                    <input type="email" name="email" placeholder="Email..." className="form-control" id="email" pattern="[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+" 
                                    title="Email should contain @ and . for correct format." 
                                    ref={(node) => { this.email = node }} />
                                </div>
                                
                                <div className="form-group">
                                    <label className="sr-only">Zipcode</label>
                                    <input type="text" id="zipcode" name="zipcode"  pattern="\d{5}"
                                    title="US zipcode should be exactly 5 digits." placeholder="Zipcode..."
                                    ref={(node) => { this.zipcode = node }}
                                    className="form-control" />
                                </div>
                                <div className="form-group">
                                    <label className="sr-only">Password</label>
                                    <input type="password" id="pwd" placeholder="Password..." name="pwd" 
                                    ref={(node) => { this.password = node }} className="form-control" />
                                </div>
                                <button className="btn btn-primary" id="submitButton" type="submit">Update</button>
                            </form>
                            <Message/>
                        </div>
                    </div>
            </div>
        )
    }
}

export default connect()(ProfileForm)