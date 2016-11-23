"use strict";
var Profile = require('./model.js').Profile

const uploadImage = require('./uploadCloudinary')


const getHeadlines = (req, res) => {
    if (!req.username) req.username = "test"
    const users = req.params.users ? req.params.users.split(',') : [req.username]
    var promise = Profile.find({ 'username' : { $in: users }}).exec()
    promise.then(function(profiles){
        var allHeadlines = []
        profiles.forEach(function(profile){
            allHeadlines.push({username: profile.username, headline: profile.headline})
        })
        res.send({headlines: allHeadlines})
    })
    
}

const putHeadline = (req, res) => {
    if (req.body.headline) {
        Profile.update({ username: req.username }, { $set: { headline: req.body.headline }}).exec()
    }
    res.send({username: req.username, headline: req.body.headline})
}

const getEmail = (req, res) => {
    Profile.findOne({ username: req.username }).exec(function(err, profile){
        res.send({username: req.username, email: profile.email})
    })
    
}

const putEmail = (req, res) => {
    if (req.body.email) {
        Profile.update({ username: req.username }, { $set: { email: req.body.email }}).exec()
    }
    res.send({username: req.username, email: req.body.email})
}

const getZipcode = (req, res) => {
    Profile.findOne({ username: req.username }).exec(function(err, profile){
        res.send({username: req.username, zipcode: profile.zipcode})
    })
}

const putZipcode = (req, res) => {
    if (req.body.zipcode) {
        Profile.update({ username: req.username }, { $set: { zipcode: req.body.zipcode }}).exec()
    }
    res.send({username: req.username, zipcode: req.body.zipcode})
}

const getAvatars = (req, res) => {
    if (!req.username) req.username = "test"
    const users = req.params.user ? req.params.user.split(',') : [req.username]
    var promise = Profile.find({ 'username' : { $in: users }}).exec()
    promise.then(function(profiles){
        var allAvatars = []
        profiles.forEach(function(profile){
            allAvatars.push({username: profile.username, avatar: profile.avatar})
        })
        res.send({avatars: allAvatars})
    })
}

const putAvatars = (req, res) => {
    res.send({username: req.username, avatar: ""})
}

const getDOB = (req, res) => {
    res.send({username: Profile.username, dob: 1479606767530})
}

const uploadAvatar = (req, res) => {
    Profile.update({username: req.username }, { $set: { avatar: req.fileurl }})
}


module.exports = app => {
     app.get('/headlines/:users*?', getHeadlines)
     app.put('/headline', putHeadline)
     app.get('/email/:user?', getEmail)
     app.put('/email', putEmail)
     app.get('/zipcode/:user?', getZipcode)
     app.put('/zipcode', putZipcode)
     app.get('/avatars/:user?', getAvatars)
     app.put('/avatar', putAvatars)
     app.get('/dob', getDOB)
}

module.exports.profile = Profile

module.exports.userLogin = (uname) => {
    Profile.username = uname
}

module.exports.userRegister = (uname, email, dob, zipcode, pwd) => {
    Profile.username = uname
    Profile.email = email
    Profile.dob = dob
    Profile.zipcode = zipcode
    Profile.password = pwd
}

module.exports.updatePwd = (pwd) => {
    Profile.password = pwd
}

module.exports.addFollower = (uid) => {
    Profile.followers.push(uid)
}

module.exports.deleteFollower = (uid) => {
    const index = Profile.followers.indexOf(uid)
    if (index !== -1){
        Profile.followers.splice(index, 1)
    }
}