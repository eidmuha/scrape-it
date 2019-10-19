var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");


module.exports = function (app) {
  // Get all examples
  app.get("/api/articles", function (req, res) {
    console.log("---------------------------------------")
    var aList = []

    // First, we grab the body of the html with axios
    var result = {};
    axios.get("https://www.nytimes.com/section/world/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      // Now, we grab every h2 within an article tag, and do the following:
      $(".css-ye6x8s").each(function (i, element) {
        // Save an empty result object

        // Add the text and href of every link, and save them as properties of the result object
        result.id = i;
        result.title = $(this)
          .children(".css-1cp3ece")
          .children(".css-1l4spti")
          .children("a")
          .children("h2")
          .text();
        result.link = $(this)
          .children(".css-1cp3ece")
          .children(".css-1l4spti")
          .children("a")
          .attr("href");
        result.description = $(this)
          .children(".css-1cp3ece")
          .children(".css-1l4spti")
          .children("a")
          .children("p")
          .text();
        // #stream-panel > div.css-13mho3u > ol > li:nth-child(1) > div > div.css-1l4spti > a > div.css-79elbk > figure > div > img
        result.image = $(this)
          .find(".css-1cp3ece")
          .find("img")
          .attr("src");

        aList.push(result)
        result = {};

      }); //each
      res.json(aList)
      // res.render("index", {articles: aList})
    }); //axios.get


  }); //app.get

  // Create a new example
  app.post("/api/articles", function (req, res) {
    db.Article.create(req.body).then(function (dbArticle) {
      res.json(dbArticle);
    });
  });

  app.get("/api/savedarticles", function (req, res) {
    console.log(">>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function (dbArticle) {
        var data = dbArticle;  
        res.render("index", data)
        // If we were able to successfully find Articles, send them back to the client
        // res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};


