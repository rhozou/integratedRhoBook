import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { uploadArticle, uploadTextOnlyArticle } from './articleActions'

class PostArticle extends Component {
    handleImageChange(e) {
        this.file = e.target.files[0]
    }

    render() {
        return (
            <form id="articleForm" onSubmit={(e) => {
                e.preventDefault()
                this.props.uploadTextOnlyArticle(this.message.value)
                this.message.value = ""
            }}>
                <div className="btn-group-vertical">
                    <label className="btn btn-default btn-file"> <span className="glyphicon glyphicon-picture"></span>
                    Add Image <input type="file" style={{"display" : "none"}} accept="image/*" onChange={(e) => this.handleImageChange(e)} />
                    </label>
                    <button type="button" className="btn btn-primary" id="cancelBtn">Cancel</button>
                    <button type="submit" id="postArticleBtn" className="btn btn-primary">Post</button>
                </div>
                <div className="col-xs-6 col-md-7">
                    <textarea className="form-control" rows="6" placeholder="What is on your mind?" 
                    ref={(node) => { this.message = node }} id="userPost"></textarea>
                    <br />
                </div>
            </form>
        )
    }


}

export default connect(null, (dispatch) => ({
    uploadTextOnlyArticle: (text) => dispatch(uploadTextOnlyArticle(text))
}))(PostArticle)