import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Article from './article'
import { searchKeyword } from './articleActions'

class ArticlesView extends Component {  
  

  render() {return (
    <div>
        <div className="col-xs-6 col-md-9">
            <div className="input-group">
                <input type="text" id="searchText" className="form-control" placeholder="Search for..."
                ref={(node) => this.keyword = node } />
                <span className="input-group-btn">
                <button type="button" id="searchBtn" className="btn btn-primary"
                onClick={() => { this.props.dispatch(searchKeyword(this.keyword.value)) }}>
                <span className="glyphicon glyphicon-search"></span> Search</button>
                </span>
                <br/>
            </div>
        </div>

        { this.props.articles.sort((a,b) => {
          if (a.date < b.date)
            return 1
          if (a.date > b.date)
            return -1
          return 0
        }).map((article) =>
          <Article key={article._id} _id={article._id} username={this.props.username} author={article.author}
            date={article.date} text={article.text} img={article.img} avatar={article.avatar}
            comments={article.comments}/>
        )}

    </div>
  )}
}

ArticlesView.propTypes = {
  username: PropTypes.string.isRequired,
  articles: PropTypes.arrayOf(PropTypes.shape({
    ...Article.propTypes
  }).isRequired).isRequired
}

export default connect(
  (state) => {
    const avatars = state.articles.avatars
    const keyword = state.articles.searchKeyword
    let articles = Object.keys(state.articles.articles).map((id) => state.articles.articles[id])
    if (keyword && keyword.length > 0) {
      articles = articles.filter((a) => {
        return a.text.toLowerCase().indexOf(keyword.toLowerCase()) >= 0 ||
               a.author.toLowerCase() === keyword.toLowerCase()
      })
    }
    articles = articles.map((a) => {
      return {...a, avatar: avatars[a.author], comments: a.comments.map((c) => {
        return { ...c, avatar: avatars[c.author] }
      })}
    })
    
    return {
      username: state.profile.username,
      articles: articles
    }
  }
)(ArticlesView)

export { ArticlesView as PureArticlesView }



/** WEBPACK FOOTER **
 ** ./src/components/article/articlesView.js
 **/