var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {    
      res.render("index");    
  });

  app.get("/savedArticles", function(req, res) {    
    db.Article.find({})
    .then(function (articles) {
      // console.log(dbArticle)
      // var articles = dbArticle;  
      res.render("savedArticles", {articles: articles})  
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  });

  // Load example page and pass in an example by id
  // app.get("/example/:id", function(req, res) {
  //   db.Example.findOne({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });

  // Render 404 page for any unmatched routes
  // app.get("*", function(req, res) {
  //   res.render("404");
  // });
};
