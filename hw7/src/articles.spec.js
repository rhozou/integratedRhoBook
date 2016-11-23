const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Validate Post Article to add article', () => {
    it('should add the article and increase the current articles size', (done) => {
        let curID
        fetch(url('/article'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({"text":"add a new one"})
        })
        .then(res => {
            expect(res.status).to.eql(200)	
			return res.text()
        })
        .then(body => {
            expect(JSON.parse(body).articles[0].text).to.equal("add a new one")
            curID = JSON.parse(body).articles[0].id
            return fetch(url('/article'), {
		            method:'POST',
		            headers: {'Content-Type': 'application/json'},
		            body: JSON.stringify({"text":"add a second one"})
        		})
        })	
        .then(res => {
            expect(res.status).to.eql(200)	
            return res.text()				
        })	
        .then(body => {
            expect(JSON.parse(body).articles[0].text).to.equal("add a second one")
            expect(JSON.parse(body).articles[0].id).to.equal(curID + 1)
        })
        .then(done)
        .catch(done)
    }, 500)
})