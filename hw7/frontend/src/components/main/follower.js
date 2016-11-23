import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { removeFollower } from './followingActions'

class Follower extends Component {

    render() {
        return (
            <div>
                <li className="followedUsers">
                    <div className="card">
                        <img src={ this.props.avatar } />
                        <div className="cardContainer">
                            <h5><b>{ this.props.name }</b></h5> 
                            <p> { this.props.headline} <button className="btn unfollowBtn"
                            onClick={() => { this.props.dispatch(removeFollower(this.props.name)) }}>Unfollow</button> </p>
                        </div>
                    </div>
                </li>
            </div>)
    }
}

Follower.propTypes = {
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    headline: PropTypes.string
}

export default connect()(Follower)