import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { uploadAvatar } from './profileActions'

class ProfileAvatar extends Component {

    constructor(props) {
        super(props)
    }

    handleImageChange(e) {
        this.file = e.target.files[0]
    }

    render() {
        return (
            <div className="row">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    this.props.uploadAvatar(this.file)
                }}>
                    <div className="col-md-6">
                        <img src={this.props.avatar} />
                        <br />
                        <label className="btn btn-default btn-file">
                            Select Image <input type="file" 
                            accept="image/*" style={{"display" : "none"}} 
                            onChange={(e) => this.handleImageChange(e)} />
                        </label>
                        <button type="submit" className="btn btn-primary">Upload Image</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default connect(null, (dispatch) => ({
    uploadAvatar: (file) => dispatch(uploadAvatar(file))
}))(ProfileAvatar)