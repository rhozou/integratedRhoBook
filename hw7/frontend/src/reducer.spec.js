import { expect } from 'chai'
import mockery from 'mockery'
import fetch, {mock} from 'mock-fetch'

import Reducer from './reducers'
import {articles} from './reducers'

let initialState = {
    common:{error:'', success: '',location: ''},
	articles:{articles:{}, searchKeyword:'', avatars: {} },
 	profile: { username: '',headline: '',avatar: '',email: '',zipcode: '',dob: ''},
 	followers:{ followers: {}}
}


describe('Validate reducer (no fetch requests here)', ()=> {
    it('should clear state when logout', ()=>{
        expect(Reducer(undefined, {type:'NAV_OUT'})).to.eql(initialState)
    })

	it('should return the initial state', ()=>{
        expect(Reducer(undefined, {})).to.eql(initialState)
    })

 	it('should state success (for displaying success message to user)', ()=>{
        expect(Reducer(undefined, {type:'SUCCESS', success:'suc'}))
        .to.eql({...initialState, common: {...initialState.common, success:'suc'}})
    })

 	it('should state error (for displaying error message to user)', ()=>{
        expect(Reducer(undefined, {type:'ERROR', error:'err'}))
        .to.eql({...initialState, common:{...initialState.common, error:'err'}})
    })

 	let articles = [{id:1,author:'xz9', text:'hhh'}]
 	it('should set the articles',()=> {
		expect(Reducer(undefined, {type:'UPDATE_ARTICLES', articles}))
		.to.eql({...initialState, articles: {...initialState.articles, articles}})
	})

    let keyword = 'key'
    it('should set the search keyword', ()=>{
        expect(Reducer(undefined, {type:'SEARCH_KEYWORD',keyword})).to.eql({...initialState, articles:{...initialState.articles, searchKeyword: keyword}})
    })

   

})