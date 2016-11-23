import { expect } from 'chai'
import mockery from 'mockery'
import fetch, { mock } from 'mock-fetch'
import Action, { updateError, updateSuccess, navToProfile, navToMain, navToOut } from './actions'
require('isomorphic-fetch')


let resource, url

describe('Validate resource and navigation', () => {
	beforeEach(() => {
		if (mockery.enable) {
			mockery.enable({warnOnUnregistered: false, useCleanCache:true})
			mockery.registerMock('node-fetch', fetch)
			require('node-fetch')
		}
		resource = require('./actions').resource
		url = require('./actions').apiUrl
	})

	afterEach(() => {
		if (mockery.enable) {
			mockery.deregisterMock('node-fetch')
			mockery.disable()
		}
	})

	it('resource should be a resource (i.e., mock a request)', (done)=> {
		
		mock(`${url}/dob`, {
			method: 'GET',
			headers: {'Content-Type':'application/json'},
			json:{dob: "2016"}
		})

		resource('GET', 'dob').then((response) => {
			expect(response).to.eql({dob: "2016"})
		})
		.then(done)
		.catch(done)
	})


// 	it('resource should give me the http error', (done)=> {
// 		const username = 'pl26'
// 		const password = 'wrong password'

// 		mock(`${url}/login`, {
// 		method: 'POST',
// 		headers: {'Content-Type': 'application/json'},
// 		json: {username, password}
// 		})

// 		resource('POST', 'login', {username, password })
// 		.catch((err) => {
// 		expect(err.toString()).to.eql('Error: Unauthorized')
// 		})
// 		.then(done)
// 		.catch(done)
//   })

	it('resource should be POSTable', (done) => {
		const username = 'xz9'
        const password = 'example-rather-forest'

        mock(`${url}/login`,{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            json: {username, result:"success"}
        })

        resource('POST', 'login', {username, password})
        .then((response) => {
			expect(response).to.eql({username:'xz9', result:"success"})
		})
        .then(done)
        .catch(done)
	})

	it('should update error message (for displaying error mesage to user)', ()=>{
		const expectAction = {
			type: Action.ERROR,
			error: 'err'
		}
		expect(updateError('err')).to.eql(expectAction);
	})


	it('should update success message (for displaying success message to user)', ()=>{
		const expectAction = {
			type: Action.SUCCESS,
			success: 'suc'
		}
		expect(updateSuccess('suc')).to.eql(expectAction);
	})

	it('should navigate (to profile, main, or landing)', ()=>{
		expect(navToOut()).to.eql({type: Action.NAV_OUT});
		expect(navToMain()).to.eql({type: Action.NAV_MAIN});
		expect(navToProfile()).to.eql({type: Action.NAV_PROFILE});
	})

})

