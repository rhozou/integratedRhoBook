// this is model.js 
"use strict";
var mongoose = require('mongoose')
require('./db.js')

var userSchema = new mongoose.Schema({
    username: String,
	salt: String,
	hash: String,
    facebookId: String
})

var profileSchema = new mongoose.Schema({
    username: String,
    headline: String,
    following: [ String ],
    email: String,
    zipcode: String,
    avatar: String    
})

var commentSchema = new mongoose.Schema({
	commentId: String, author: String, date: Date, text: String
})
var articleSchema = new mongoose.Schema({
	author: String, img: String, date: Date, text: String,
	comments: [ commentSchema ]
})

exports.Article = mongoose.model('article', articleSchema)
exports.Comment = mongoose.model('comment', commentSchema)
exports.User = mongoose.model('user', userSchema)
exports.Profile = mongoose.model('profile', profileSchema)

