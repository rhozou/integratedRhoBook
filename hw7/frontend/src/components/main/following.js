import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { addFollower, removeFollower } from './followingActions'
import Follower from './follower'


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


class Following extends Component {
    render() { 
        let newUser
        return (
        <div>
            
            { Object.keys(this.props.followers).sort().map((followerName) => this.props.followers[followerName]).map((follower) =>
                <Follower key={follower.name}
                    name={follower.name} avatar={follower.avatar} headline={follower.headline}
                 />
            )}

            <li>
                <br />
                <input type="text" name="newUser" placeholder="New User..." className="form-control" 
                id="newUser" ref={(node) => {newUser = node}} />
                <button className="btn" id="addUserBtn"
                onClick={() => { this.props.dispatch(addFollower(newUser.value)) }}>Add</button>
            </li>

            <li>
                <Message/>
            </li>
                
        </div>
    )}
}

Following.propTypes = {
    followers: PropTypes.arrayOf(PropTypes.shape({
    ...Follower.propTypes
  }).isRequired).isRequired
}

export default connect(
    (state) => {
        return {
            followers: state.followers.followers
        }
    }
)(Following)



/** WEBPACK FOOTER **
 ** ./src/components/main/following.js
 **/