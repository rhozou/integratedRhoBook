const expect = require('chai').expect
const fetch = require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`

describe('Validate Put Headline update user headline', () => {
    it('should update the headline and return the updated user headline', (done) => {
        fetch(url('/headline'), {
            method: 'PUT',
            headers:new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({"headline":"hello world"})
        })
        .then(res => {
            expect(res.status).to.eql(200)	
			return res.text()
        })
        .then(body => {
            expect(JSON.parse(body).headline).to.equal("hello world")
            return JSON.parse(body).headline
        })
        .then((newHeadline) => {
            fetch(url('/headline'))
            .then(res => {
                expect(res.status).to.eql(200)	
			    return res.text()
            })
            .then(body => {
                expect(JSON.parse(body).headline).to.equal(newHeadline)
            })
        })
        .then(done)
        .catch(done)
    }, 500)
})