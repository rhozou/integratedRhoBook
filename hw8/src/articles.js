"use strict";
var Article = require('./model.js').Article
var Comment = require('./model.js').Comment
var Profile = require('./model.js').Profile
const md5 = require('md5')

const addArticle = (req, res) => {
     var newArticle = new Article({ author: req.username, img: "", date: new Date(), text: req.body.text, comments: []})
     newArticle.save(function(err, art){
         if(err) return console.log(err)
         res.send({articles: [art]})
     })
}

const updateArticle = (req, res) => {
    var commentId = req.body.commentId

    if (commentId){
        if (commentId === -1){
            // add new comment into the article
            Article.findOne({_id: req.params.id }).exec(function(err, article){
                var newComment = new Comment({ commentId: md5(req.username + new Date()), 
                    author: req.username, date: new Date(), text: req.body.text})
                article.comments.push(newComment)
                article.save(function(err, newart){
                    res.send({articles: [newart]})
                })
            })
        }
        else{
            // find the comment and update the text
            Article.findOne({_id: req.params.id }).exec(function(err, article){
                article.comments.forEach(function(comment) {
                    if (comment.commentId === commentId){
                        comment.text = req.body.text
                    }
                }, this);
                article.save(function(err, newart){
                    res.send({articles: [newart]})
                })
            })
        }
    }
    else{
        Article.findOne({_id: req.params.id }).exec(function(err, article){
            article.text = req.body.text
            article.save(function(err, newart){
                res.send({articles: [newart]})
            })
        })
    }
}

const getArticles = (req, res) => {
    if (req.params.id){
        Article.findOne({ _id: req.params.id }).exec(function(err, art){
            res.send({articles: [art]})
        })
    }
    else{
        Profile.findOne({username: req.username}).exec(function(err, profile){
            var followers = profile.following
            followers.push(req.username)
            var promise = Article.find({ 'author' : { $in: followers }}).sort({date: -1}).limit(10).exec()
            promise.then(function(allArticles){
                res.send({articles: allArticles})
            })
        })
    }    
}

module.exports = app => {
     app.post('/article', addArticle)
     app.get('/articles/:id*?', getArticles)
     app.put('/articles/:id', updateArticle)
}