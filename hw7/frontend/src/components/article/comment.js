import moment from 'moment'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { updateComment } from './articleActions'

class Comment extends Component {

    constructor(props) {
        super(props)
        this.editComment = true
        this.userOwned = (this.props.author === this.props.username)
    }

    render() {
        const date = moment(new Date(this.props.date))
        return (
        <div className="row">
            <div className="col-xs-6 col-md-9">
                <div className="commentCard">
                    <div className="media">
                        <div className="media-left">
                            <img className="mediaAvatar" src={ this.props.avatar } />
                        </div>
                        <div className="media-body">
                            <a href="#">{this.props.author}</a>
                            <br/> {date.format('MM-DD-YYYY')} - {date.format('HH:mm:ss')} <span className="glyphicon glyphicon-user"></span>
                        </div>
                        
                        <p>{this.props.text}</p>

                        { this.userOwned ? <button className="btn btn-primary" onClick={() => {
                            this.editComment = !this.editComment
                            this.forceUpdate()
                        }}>
                        { this.editComment ? 'Edit Comment' : 'Cancel' } </button> : '' }

                        { this.editComment ? '' : <div className="row">
                                                    <div className="col-xs-5 col-md-7">
                                                        <textarea className="form-control" rows="3"  
                                                        ref={(node) => { this.message = node }} id="editPost"></textarea>
                                                    </div>
                                                    <button type="submit" className="btn btn-primary"
                                                    onClick={() => {
                                                        this.props.dispatch(updateComment(this.message.value, this.props.articleId, this.props.commentId))
                                                        this.message.value = ''
                                                    }}>Submit</button>
                                                </div>
                        }
                        
                    </div>
                </div>
            </div>
      </div>
    )}
}

Comment.propTypes = {
    author: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    avatar: PropTypes.string,
}

export default connect()(Comment)



/** WEBPACK FOOTER **
 ** ./src/components/article/comment.js
 **/