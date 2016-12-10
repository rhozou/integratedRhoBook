// this is dbarticle.js 
"use strict";
var Article = require('./model.js').Article

function find(req, res) {
     findByAuthor(req.params.user, function(items) {
          res.send({items})
     })
}

module.exports = (app) => {
     app.get('/find/:user', find)
}


function findByAuthor(author, callback) {
	Article.find({ author: author }).exec(function(err, items) {
		console.log('There are ' + items.length + ' entries for ' + author)
		var totalLength = 0
		items.forEach(function(article) {
			totalLength += article.text.length
		})
		console.log('average length', totalLength / items.length)		
		callback(items)
	})
}

//////////////////////////////
// remove these examples 

Article.find(function(){
    console.log('done with save')
    process.exit()
})

// new Article({}).save(function() {
//      console.log('done with save')
//      Article.find().exec(function(err, items) { 
//           console.log("There are " + items.length + " articles total in db") 

//           findByAuthor('sep1', function() {
//               findByAuthor('jmg3', function() {
//                   console.log('complete')
//                   process.exit()
//               })
//           })
//      })
// })

//////////////////////////////
// remove the above example code
//////////////////////////////
