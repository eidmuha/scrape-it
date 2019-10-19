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
    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/section/world/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $(".css-ye6x8s").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
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

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
           res.send("Scrap Completed")
          })
          .catch(function (err) {
            // If an error occurred, log it
            res.end(err);
          });
      });//each

    });  //axios.get

  });//app.get

  // Create a new example
  // app.post("/api/examples", function(req, res) {
  //   db.Example.create(req.body).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });

  // Delete an example by id
  // app.delete("/api/examples/:id", function(req, res) {
  //   db.Example.destroy({ where: { id: req.params.id } }).then(function(dbExample) {
  //     res.json(dbExample);
  //   });
  // });
};
