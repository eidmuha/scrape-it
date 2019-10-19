var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");


module.exports = function (app) {
  // Get all examples
  app.get("/api/articles", function (req, res) {
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
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


  // Route for grabbing a specific Article by id, populate it with it's note
app.get("/api/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for retrieving all Notes from the db
app.get("/api/notes/:id", function(req, res) {
  // Find all Notes
  db.Note.find({_id: req.params.id })
    .then(function(dbNote) {
      // If all Notes are successfully found, send them back to the client
      res.json(dbNote);
    })
    .catch(function(err) {
      // If an error occurs, send the error back to the client
      res.json(err);
    });
});



  app.post("/api/notes/:id", function (req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) { // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
  });

  // Delete an Article by id
  app.delete("/api/articles/:id", function(req, res) {
    db.Article.remove({"_id": req.params.id}).then(function(dbArticle) {
      res.json(dbArticle);
    });
  });

  // Delete an example by id
  app.delete("/api/note/:id", function(req, res) {
    console.log("NNNNNNNNNNNNNN ", req.params.id)
    db.Note.findByIdAndDelete(req.params.id).then(function(dbNote) {

      res.json(dbNote);
    }).catch(function(error){
      console.log(error)
    })
  });
};


