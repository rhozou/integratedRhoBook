import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { register } from './authActions'

class Register extends Component {


    render() { return (
        <form role="form" id="regForm" onSubmit={(e) => {
                e.preventDefault()
                this.props.dispatch(register(this.username.value,
                    this.email.value,
                    this.dob.value,
                    this.zipcode.value,
                    this.password.value))
                    this.email.value = ''
                    this.dob.value = ''
                    this.zipcode.value = ''
                    this.password.value = ''
            }} >
            <div className="form-group">
                <label className="sr-only">Account Name</label>
                <input type="text" name="accountName" placeholder="Account name..." className="form-control" id="accountName" 
                pattern="[A-Za-z]+[A-Za-z0-9]*" 
                title="Account name can only be upper or lower case letters and numbers, but may not start with a number" 
                ref={(node) => { this.username = node }} required />
            </div>
            <div className="form-group">
                <label className="sr-only">Email</label>
                <input type="email" name="email" placeholder="Email..." className="form-control" id="email" pattern="[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+" 
                title="Email should contain @ and . for correct format." 
                ref={(node) => { this.email = node }} required />
            </div>
            <div className="form-group">
                <label className="sr-only">Phone</label>
                <input type="text" name="phone" placeholder="Phone..." className="form-control" id="phone" pattern="\d{3}-\d{3}-\d{4}"
                title="Phone number should be format of 123-123-1234" 
                ref={(node) => { this.phone = node }} />
            </div>
            <div className="form-group">
                <label className="sr-only">Date of Birth</label>
                <input type="Date" id="bday" name="bday" 
                        placeholder="Date of birth..." className="form-control" 
                        ref={(node) => { this.dob = node }} required />
            </div>
            <div className="form-group">
                <label className="sr-only">Zipcode</label>
                <input type="text" id="zipcode" name="zipcode"  pattern="\d{5}"
                title="US zipcode should be exactly 5 digits." placeholder="Zipcode..."
                className="form-control" ref={(node) => { this.zipcode = node }} required />
            </div>
            <div className="form-group">
                <label className="sr-only">Password</label>
                <input type="password" id="pwd" placeholder="Password..." name="pwd" className="form-control" 
                ref={(node) => { this.password = node }} required />
            </div>
            <div className="form-group">
                <label className="sr-only">Password Confirmation</label>
                <input type="password" id="pwdCfm" placeholder="Password Confirmation..." name="pwdCfm" className="form-control" 
                ref={(node) => { this.pwdCfm = node }} required />
            </div>
            <button className="btn btn-primary" id="registerButton" type="submit">Register!</button>
        </form>
    )}
}

export default connect()(Register)



