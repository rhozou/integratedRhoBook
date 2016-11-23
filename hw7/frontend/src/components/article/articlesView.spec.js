import React from 'react'
import {shallow} from 'enzyme'
import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'
import {ArticlesView} from './articlesView'


import Reducer from '../../reducers'
import {articles} from '../../reducers'

let initialState = {
    common:{error:'', success: '',location: ''},
    articles:{articles:{},searchKeyword:'', avatars: {} },
    profile: { username: '',headline: '',avatar: '',email: '',zipcode: '',dob: ''},
    followers:{ followers: {}}
}


describe('ArticlesView Test ', ()=>{
    it('should render articles', ()=>{
    	const articles = [{id:1,  author:'xz9', comments:[]}]
		const node = shallow(
			<div>
			<ArticlesView articles = {articles} dispatch={_ => _}/>
			</div>
			)
		expect(node.children().length).to.eql(1);
	
    })

    let articles = {1:{id:1,author:'xz9', text:'haha'}}  
    let new_article = {id:2,author:'aaa', text:'bbb'}
    let new_articles = {...articles, 2: new_article}

    it('should dispatch actions to create a new article',()=> {
        expect(Reducer(Reducer(undefined, {type:'UPDATE_ARTICLES', articles}), {type:'ADD_ARTICLE',article: new_article }))
       .to.eql({...initialState, articles: {...initialState.articles, articles:new_articles }})
    })
})