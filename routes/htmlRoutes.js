var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {    
      res.render("index");    
  });

  app.get("/savedArticles", function(req, res) {    
    db.Article.find({})
    .then(function (articles) {
      res.render("savedArticles", {articles: articles})  
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
