import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'
import {localLogin, logout } from './authActions'


let resource,url
describe('Validate authenticate actions', () => {
    
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

    it('should log in the user', ()=> {
        const username = 'xz9'
        const password = 'example-rather-forest'
        mock(`${url}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            json: {username, result:'success'}
        })

        localLogin(username, password)((action)=>{           
            expect(action).to.eql({
                type:'LOGIN_LOCAL',
                username
            })}
        )
    })
 
    it('should not log in an invalid user', ()=>{
        const username = 'invaliduser'
        const password = 'invalidpwd'
        mock(`${url}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'text/plain'},
            status: 401,
            statusText: 'Unauthorized'
        })
        localLogin(username, password)((action)=>{
            expect(action).to.eql({
                type:'ERROR',
                error : `Error appears when logging in as ${username}`
            })}
        )
    })

    it('should log out a user', ()=> {
        mock(`${url}/logout`,{
            method: 'PUT',
            headers: {'Content-Type':'application/json'}
        })
        logout()((action)=>{
            expect(action).to.eql({
                type:'NAV_OUT'
            })
        })
    })

})