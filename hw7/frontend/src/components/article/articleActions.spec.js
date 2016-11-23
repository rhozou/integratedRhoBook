import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'
import {fetchArticles, searchKeyword} from './articleActions'

let url

describe('article Actions Test ', () => {

    beforeEach(() => {
        if (mockery.enable) {
            mockery.enable({warnOnUnregistered: false, useCleanCache:true})
            mockery.registerMock('node-fetch', fetch)
            require('node-fetch')
            url = require('../../actions').apiUrl
        }
    })

    afterEach(() => {
        if (mockery.enable) {
            mockery.deregisterMock('node-fetch')
            mockery.disable()
        } 
    })  


    it('should fetch articles (mocked request)', ()=>{
        const articles = [{id: 1, author: 'xz9', comments: [] }]
        mock(`${url}/articles`,{
            method:'GET',
            headers: {'Content-Type':'application/json'},
            json: { articles: articles}
        })

        fetchArticles()((action) =>{
            expect(action).to.eql({
                type:'UPDATE_ARTICLES',
                articles
        })})

    })

    it('should update the search keyword', ()=>{
        const keyword = 'hello'
        expect(searchKeyword(keyword)).to.eql({type:'SEARCH_KEYWORD',keyword})
        
    })



})