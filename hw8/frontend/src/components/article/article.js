import moment from 'moment'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Comment from './comment'
import { updateArticle, addComment } from './articleActions'

class Article extends Component {

  constructor(props) {
    super(props)
    this.hideComments = true
    this.userOwned = (this.props.author === this.props.username)
    this.editPost = true
    this.addComment = true
  }

  render() {
    const date = moment(new Date(this.props.date))
    return (
        <div className="row">
            <div className="col-xs-6 col-md-9">
                <div className="card articleCard">
                    <div className="media">
                        <div className="media-left">
                            <img className="mediaAvatar" src={ this.props.avatar } />
                        </div>
                        <div className="media-body">
                            <a className="authorText" href="#">{this.props.author}</a>
                            <br/> {date.format('MM-DD-YYYY')} - {date.format('HH:mm:ss')} <span className="glyphicon glyphicon-user"></span>
                        </div>
                        <img className="img-responsive" src={this.props.img} />
                        <p className="articleText">{this.props.text}</p>
                        <br/>
                        <button className="btn btn-primary" onClick={() => {
                            this.hideComments = !this.hideComments
                            this.forceUpdate()
                        }}>
                        { this.hideComments ? 'Show' : 'Hide' } Comments </button>
                        
                        { this.userOwned ? <button className="btn btn-primary editPost" onClick={() => {
                            this.editPost = !this.editPost
                            this.forceUpdate()
                        }}>
                        { this.editPost ? 'Edit Post' : 'Cancel' } </button> : '' }

                        <button className="btn btn-primary" onClick={() => {
                            this.addComment = !this.addComment
                            this.forceUpdate()
                        }}>
                        { this.addComment ? 'Add Comment' : 'Cancel' } </button>

                        { this.hideComments ? '' : this.props.comments.sort((a,b) => {
                            if (a.date < b.date)
                                return 1
                            if (a.date > b.date)
                                return -1
                            return 0
                            }).map((comment) =>
                                <Comment key={comment.commentId} articleId={this.props._id} username={this.props.username}
                                commentId={comment.commentId} author={comment.author} date={comment.date}
                                text={comment.text} avatar={comment.avatar} />
                        )}

                        { this.editPost ? '' : <div className="row">
                                                    <div className="col-xs-6 col-md-7">
                                                        <textarea id="editPostText" className="form-control" rows="3"  
                                                        ref={(node) => { this.message = node }} ></textarea>
                                                    </div>
                                                    <button type="submit" className="btn btn-primary editPostSubmit"
                                                    onClick={() => {
                                                        this.props.dispatch(updateArticle(this.message.value, this.props._id))
                                                        this.message.value = ''
                                                    }}>Submit</button>
                                                </div>
                        }

                        { this.addComment ? '' : <div className="row">
                                                    <div className="col-xs-6 col-md-7">
                                                        <textarea className="form-control" rows="3"  
                                                        ref={(node) => { this.message = node }} id="addComment"></textarea>
                                                    </div>
                                                    <button type="submit" className="btn btn-primary"
                                                    onClick={() => {
                                                        this.props.dispatch(addComment(this.message.value, this.props._id))
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

Article.propTypes = {
  _id: PropTypes.number.isRequired,
  author: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  date: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  img: PropTypes.string,
  comments: PropTypes.arrayOf(PropTypes.shape({
    ...Comment.propTypes
  }).isRequired).isRequired
}

export default connect()(Article)



/** WEBPACK FOOTER **
 ** ./src/components/article/article.js
 **/