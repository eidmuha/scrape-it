var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    // Find all Users
    db.Article.find({})
    .then(function(dbArticle) {
      // If all Users are successfully found, send them back to the client
      res.render("index", {
        article: dbArticle
      });
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
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
