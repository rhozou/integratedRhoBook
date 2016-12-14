"use strict";
const md5 = require('md5')
const cookieParser = require('cookie-parser') 
var User = require('./model.js').User
var Profile = require('./model.js').Profile
const passport = require('passport')
const FacebookStrategy = require('passport-facebook')
var redis = require('redis').createClient('redis://h:p63f1038b177148a3196e253716854625b3a849f7fea7e042131f60457f19c432@ec2-50-17-239-57.compute-1.amazonaws.com:11939')
const session = require('express-session')

const usersMap = {}
const cookieKey = 'sid'
const secret = 'i love google i love google i love google i love google i love google'
const config = { clientSecret: 'd342da722aa1746b7d4335d2fc617bdd',
    clientID: '1016275288481588', callbackURL: 'http://localhost:3000/auth/facebook/callback',
     profileFields: ['id', 'emails', 'first_name', 'last_name', 'gender']}


let frontUrl = ""

const getHostURL = (req, res, next) => {
	if(frontUrl === ''){
		frontUrl = req.headers.referer
		console.log(frontUrl)
	}
	next()
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

const isAuthorized = (salt, pwd, hash) => {
    return md5(pwd+salt) === hash
}


const login = (req, res) => {
    var username = req.body.username
    var password = req.body.password
    if (!username || !password) {
        res.sendStatus(401)
        return
    }


    User.findOne({username: username}).exec(function(err, targetUsr){
        
        if (!targetUsr || !isAuthorized(targetUsr.salt, password, targetUsr.hash)){
            res.sendStatus(401)
            return
        }

         // "security by obscurity" we don't want people guessing a sessionkey
        const sessionKey = md5(secret + new Date().getTime() + targetUsr.username)
        redis.hmset(cookieKey, targetUsr)
        
        // this sets a cookie
        res.cookie(cookieKey, sessionKey, { maxAge: 3600*1000, httpOnly: true})
        res.send({username: req.body.username, result: "success"})
    })
    
}

passport.serializeUser(function(user, done){
    console.log("serialize!!!")
    done(null, user.id)
})

passport.deserializeUser(function(id, done){
    console.log("deserialize!!!")
    User.findOne({facebookId: id}).exec(function(err, user) {
        console.log(user)
		done(null, user)
	})
})

passport.use(new FacebookStrategy(config, 
    function(token, refreshToken, profile, done){
        process.nextTick(function(){
            User.findOne({ 'facebookId' : profile.id }, function(err, user) {
                if(user){
                    console.log("find user here!!!")
                    return done(null, profile)
                }
                else{
                    var uname = profile.name.givenName + profile.name.familyName + "@facebook"
                    var newUser = new User({username: uname, facebookId: profile.id})
                    var newProfile = new Profile({username: uname, headline: "",
                        email: profile.emails[0].value, zipcode: ""})
                    newProfile.save(function(err, usr){
                        if(err) return console.log(err)
                    })
                    newUser.save(function(err){
                        if(err){
                            throw err
                        }
                        console.log("save user here!!!")
                    }).exec()
                }
                return done(null, profile)
            })
        })
}))


function isLoggedIn(req, res, next) {
    console.log("check log in")
    console.log(req.isAuthenticated)
    if (req.isAuthenticated()){
        next()
    }
    else{
        var sid = req.cookies[cookieKey]
        if (!sid){
            return res.sendStatus(401)
        }

        redis.hgetall(cookieKey, function(err, userObj){
            if (err) console.error(`There was an error ${err}`)
            if (userObj){
                req.username = userObj.username
                next()
            }
            else{
                return res.sendStatus(401)
            }
        })
    }
}


const logout = (req, res) => {
    res.clearCookie(cookieKey)
    res.send("OK")
}

const register = (req, res) => {
    var username = req.body.username;
	var password = req.body.password;
	if(!username || !password){
		res.sendStatus(401)
		return
	}
	else{
        const randomSaltCnt = getRandomInt(1,1000)
        var userSalt = username + randomSaltCnt + username
        var hashSalt = md5(password + userSalt)
        var newUser = new User({ username: username, salt: userSalt, hash: hashSalt})
        newUser.save(function(err, usr){
            if(err) return console.log(err)
        })
        var newProfile = new Profile({ username: username, headline: "",
                        email: req.body.email, zipcode: req.body.zipcode })
        newProfile.save(function(err, usr){
            if(err) return console.log(err)
        })
        res.send({username: req.body.username, result: "success"})
	}

}

const password = (req, res) => {
    var username = req.username
    var password = req.body.password
    const randomSaltCnt = getRandomInt(1,1000)
    var userSalt = username + randomSaltCnt + username
    var hashSalt = md5(password + userSalt)
    User.update({ username: username }, { $set: { salt: userSalt }}).exec()
    User.update({ username: username }, { $set: { hash: hashSalt }}).exec()
    res.send({username: username, status: "will not change"})
}

const fbLogin = (req, res) => {
    console.log(frontUrl)
    res.redirect(frontUrl)
}

function fail(req, res) {
    return res.sendStatus(401)
}



module.exports = app => {
     app.use(cookieParser())
     app.use(getHostURL)
     app.use(session({secret:'mysecret', resave: false, saveUninitialized: false}))
     app.use(passport.initialize())
     app.use(passport.session())
     app.use('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email']}))
     app.use('/auth/facebook/callback', passport.authenticate('facebook', 
     { failureRedirect: '/fail'}), fbLogin)
     app.use('/fail', fail)
     app.post('/login', login)
     app.post('/register', register)
     app.use(isLoggedIn)
     app.put('/logout', logout)
     app.put('/password', password)
}