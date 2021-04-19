const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model('Article', articleSchema);

app.route('/articles')
  .get(function(req, res) {
    Article.find({}, function(err, results) {
      if (err) {
        res.send(err);
      } else {
        res.send(results);
      }
    })
  })
  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    })
    newArticle.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully added article")
      }
    })
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Succesfully deleted all articles")
      }
    })
  });

app.route("/articles/:customRoute")
  .get(function(req, res) {
    Article.findOne({
      title: req.params.customRoute
    }, function(err, result) {
      if (!err || result) {
        res.send(result);
      } else {
        console.log(err);
        res.send("No article found");
      }
    })
  })
  .put(function(req, res) {
    Article.update({
        title: req.params.customRoute
      }, {
        title: req.body.title,
        content: req.body.content
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("succesfully update article")
        }
      })
  })
  .patch(function(req, res) {
    Article.update({
      title: req.params.customRoute
    }, {
      $set: req.body //this is beacuse $set method accept an object, and req.body dinamically set an object based on client wants
    }, function(err) {
      if (!err) {
        res.send("Succesfully update article")
      } else {
        res.send(err);
      }
    })
  })
  .delete(function(req, res) {
    Article.deleteOne({
      title: req.params.customRoute
    }, function(err) {
      if (!err) {
        res.send("Succesfully delete article");
      } else {
        res.send(err);
      }
    })
  })

app.listen(3000, function() {
  console.log("Server started at port 3000");
})
