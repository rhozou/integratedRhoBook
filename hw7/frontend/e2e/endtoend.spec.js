import { expect } from 'chai'
import { findId, sleep, go, findClass } from './selenium'



describe('Test Landing Page', () => {

    it('should register a new user', (done) => {
        go()
        .then(sleep(500))
        .then(findId('accountName').sendKeys('rho'))
        .then(findId('email').sendKeys('xz9@rice.edu'))
        .then(findId('zipcode').sendKeys('11111'))
        .then(findId('bday').sendKeys('1991-01-01'))
        .then(findId('pwd').sendKeys('aaa'))
        .then(findId('pwdCfm').sendKeys('aaa'))
        .then(findId('registerButton').click())
        .then(sleep(2000))
        .then(findId('message').getText().then(
            text => {
                expect(text).to.equal('You successfully registered as rho')
            }
        ))
        .then(done)
    })

    it('should log in as test user', (done) => {
        sleep(100)
        .then(findId('username').sendKeys('xz9'))
        .then(findId('password').sendKeys('example-rather-forest'))
        .then(findId('loginBtn').click())
        .then(sleep(2000))
        .then(findId('loggedinUsername').getText().then(
            text => {
                expect(text).to.equal('xz9')
            }
        ))
        .then(done)
    })

    it('should add new article and validate article appears in feed', (done) => {
        sleep(100)
        .then(findId('userPost').sendKeys('add new article'))
        .then(findId('postArticleBtn').click())
        .then(sleep(2000))
        .then(findClass('articleText')
        .then((arr) => {
                arr.forEach(function(p){
                    p.getText().then(
                        text => {
                            if(text === 'add new article'){
                                done()
                            }
                        }
                    )
                })
                
            })
        )
        .catch(done)
    })

    it('should edit an article and validate changed article text', (done) => {
        sleep(200)
        .then(findClass('btn btn-primary editPost').then((arr) => {
                arr[0].click()
            })
        )
        .then(findId('editPostText').sendKeys('edit article text3'))
        .then(findClass('btn btn-primary editPostSubmit').then((btns) => {
                btns[0].click()
            })
        )
        .then(sleep(500))
        .then(findClass('articleText').then((art) => {
                art[0].getText().then((text) => {
                    expect(text).to.equal('edit article text3')
                })
            })
        )
        .then(done)
    })

    it('should update headline and verify change', (done) => {
        sleep(100)
        .then(findId('statusInput').sendKeys('my headline'))
        .then(findId('updateStatusBtn').click())
        .then(sleep(1000))
        .then(findId('status').getText().then((text) => {
            expect(text).to.equal('my headline')
        }))
        .then(done)
    })

    it('Add the Follower user and verify following count increases by one', (done) => {
        const cnt = 2
        sleep(500)
        .then(findClass('followedUsers').then((followers) => {
            expect(followers.length).to.equal(cnt)
        }))
        .then(findId('newUser').sendKeys('pl26'))
        .then(findId('addUserBtn').click())
        .then(sleep(500))
        .then(findClass('followedUsers').then((followers) => {
            expect(followers.length).to.equal(cnt+1)
        }))
        .then(done)
    })

    it('should remove the Follower user and verify following count decreases by one', (done) => {
        const fcnt = 3
        sleep(500)
        .then(findClass('followedUsers').then((followers) => {
            expect(followers.length).to.equal(fcnt)
         }))
        .then(findClass('btn unfollowBtn').then((btns) => {
            btns[0].click()
        }))
        .then(sleep(500))
        .then(findClass('followedUsers').then((followers) => {
            expect(followers.length).to.equal(fcnt-1)
         }))
        .then(done)
    })

    it('should search for special article and verify author', (done) => {
        sleep(500)
        .then(findId('searchText').sendKeys('edit article text3'))
        .then(findId('searchBtn').click())
        .then(sleep(500))
        .then(findClass('card articleCard').then((arts) => {
            expect(arts.length).to.equal(1)
        }))
        .then(findClass('authorText').then((authors) => {
            authors[0].getText().then((text) => {
                expect(text).to.equal('xz9')
            })
        }))
        .then(done)
    })

    it('should update email, zipcode and password', (done) => {
        findId('profileBtn').click()
        .then(findId('email').sendKeys('abc@rice.edu'))
        .then(findId('zipcode').sendKeys('77005'))
        .then(findId('pwd').sendKeys('aaa'))
        .then(findId('submitButton').click())
        .then(sleep(500))
        .then(findId('emailValue').getText().then((text) => {
            expect(text).to.equal('abc@rice.edu')
        }))
        .then(findId('zipcodeValue').getText().then((text) => {
            expect(text).to.equal('77005')
        }))
        .then(done)
    })


})