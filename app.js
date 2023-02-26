//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//---------- mongo db setup-------------

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb+srv://Mahi:test123@cluster0.8i9qq4g.mongodb.net/wikiDb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//--------------APIs------------------------------

///////aaticles//////////
app
  .route("/articles")
  .get(async (req, res) => {
    Article.find({}, function (err, foundArticles) {
      if (!err) return res.send(foundArticles);
      else return res.status(404).send(error.details[0].message);
    });
  })

  .post(async (req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) res.send("added new article");
      else res.status(404).send(error.details[0].message);
    });
  })

  .delete(async (req, res) => {
    Article.deleteMany({}, function (err) {
      if (!err) res.send("deleted");
      else res.status(404).send(error.details[0].message);
    });
  });

//////////specific articles////////////
app
  .route("/articles/:articleTitle")
  .get(async (req, res) => {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticles) {
        if (foundArticles) res.send(foundArticles);
        else res.status(404).send("no articles found :(");
      }
    );
  })
  // space is represented by %20 for article title containing space
  .put(async (req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set: { title: req.body.title, content: req.body.content } },
      { new: true },
      function (err) {
        if (!err) res.send("updated entire doc");
        else res.status(404).send(error.details[0].message);
      }
    );
  })
  .patch(async (req, res) => {
    Article.findOneAndUpdate(
      { title: req.params.articleTitle },
      { $set: req.body },
      { new: true },
      function (err) {
        if (!err) res.send("updated!");
        else res.status(404).send(err.details[0].message);
      }
    );
  })
  // req.body is equivalent to {title:req.body.title, content:req.body.content}
  .delete(async (req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, function (err) {
      if (err) res.status(404).send(err.details[0].message);
      res.send("article is deleted!");
    });
  });

// -------------------------------------------

const port = 5000 || process.env.PORT;

app.listen(port, () => {
  console.log("Server started on port " + port);
});
