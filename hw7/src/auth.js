"use strict";
const md5 = require('md5')
const cookieParser = require('cookie-parser') 
var User = require('./model.js').User
var Profile = require('./model.js').Profile
var redis = require('redis').createClient('redis://h:p92s0ro3qk55o140vsaqpa1ev87@ec2-54-83-60-31.compute-1.amazonaws.com:15309')

const sessionUser = {}
const cookieKey = 'sid'
const secret = 'i love google i love google i love google i love google i love google'

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

function isLoggedIn(req, res, next) {
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


module.exports = app => {
     app.post('/login', login)
     app.post('/register', register)
     app.use(isLoggedIn)
     app.put('/logout', logout)
     app.put('/password', password)
}