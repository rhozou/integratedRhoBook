"use strict";
var Profile = require('./model.js').Profile

const getFollowedUsers = (req, res) => {
    Profile.findOne({ username: req.username }).exec(function(err, profile){
        res.send({username: req.username, following: profile.following })
    })
}

const addFollower = (req, res) => {
    if (req.params.user){
        Profile.findOne({ username: req.params.user }).exec(function(err, profile){
            // if profile found
            if (profile){
                Profile.findOne({ username: req.username }).exec(function(err, profile){
                    if (profile.following.indexOf(req.params.user) === -1){
                        profile.following.push(req.params.user)
                    }
                    profile.save(function(err, newp){
                        res.send({username: req.username, following: newp.following })
                    })
                })
            }
            else{
                Profile.findOne({ username: req.username }).exec(function(err, profile){
                    res.send({username: req.username, following: profile.following })
                })
            }
        })
    }
}

const deleteFollower = (req, res) => {
    if (req.params.user){
        Profile.findOne({ username: req.username }).exec(function(err, profile){
            profile.following.splice(profile.following.indexOf(req.params.user), 1)
            profile.save(function(err, newp){
                res.send({username: req.username, following: newp.following })
            })
        })
    }
}

module.exports = app => {
     app.get('/following/:user?', getFollowedUsers)
     app.put('/following/:user', addFollower)
     app.delete('/following/:user', deleteFollower)
}