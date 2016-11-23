import React from 'react'
import { connect } from 'react-redux'
import Headline from './headline'
import ArticlesView from '../article/articlesView'
import PostArticle from '../article/postArticle'
import Nav from './nav'
import Following from './following'

const Main = () => (
    
    <div className="container-fluid">
            <div className="row" >

                <div className="col-xs-6 col-md-3">
                    <ul className="nav nav-pills nav-stacked">
                        <Nav/>
                        <Headline/>
                        <Following/>
                    </ul>
                </div>

                <div className="col-xs-6 col-md-9">
                    <h1><strong>Welcome to OwlBook!</strong></h1>

                    
                    <h5>A place where you can connect anybody from Rice campus</h5>
                    <br/>
                    
                    <PostArticle/>
                    
                    <ArticlesView/>
                </div>  
            </div>        
        </div>  
)

export default Main



/** WEBPACK FOOTER **
 ** ./src/components/main/main.js
 **/