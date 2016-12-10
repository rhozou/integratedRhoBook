import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateHeadline } from '../profile/profileActions'

class Headline extends Component {

    render() { return (
        <li>
            <div className="card">
                <img src={ this.props.avatar } />
                <div className="cardContainer">
                    <h5>
                        <span id="loggedinUsername">
                            <b>{ this.props.username }</b>
                        </span>
                    </h5> 
                    <span id="status">{ this.props.headline }</span>

                    <input type="text" name="status" id="statusInput" 
                    placeholder="Status..." className="form-control" 
                    ref={ (node) => { this.newHeadline = node }}
                     />
                    
                    <button className="btn" id="updateStatusBtn"
                    onClick={() => {
                            this.props.dispatch(updateHeadline(this.newHeadline.value))
                            this.newHeadline.value = ''
                    }}>Update</button>
                </div>
            </div>
        </li>
    )}
}
export default connect(
    (state) => {
        return {
            username: state.profile.username,
            headline: state.profile.headline,
            avatar: state.profile.avatar
        }
    }
)(Headline)



/** WEBPACK FOOTER **
 ** ./src/components/main/headline.js
 **/