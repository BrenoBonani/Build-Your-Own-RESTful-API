const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));



// CONNECT TO MONGOOSE

mongoose.connect("mongodb://localhost:27017/wikiDB");

// ARTICLE SCHEMA

const articleSchema = {
    title: String,
    content: String,
}

// ARTICLE MODEL 

const Article = mongoose.model("Article", articleSchema);


// REQUEST ALL ARTICLES 
app.route("/articles")

    .get((req, res) => {
    Article.find((err, foundArticles) => {
        if (!err) {
            console.log(foundArticles);   
        } else {
            console.log(err);
        }    
    });
})
    .post((req, res) => {
    console.log(req.body.title);
    console.log(req.body.content);

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
    
    newArticle.save((err) => {
        if (!err) {
            res.send("Successfuly new added a new article!")
        } else {
            res.send(err);
        }
    });
})

    .delete((req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Successfuly deleted all articles!");
        } else {
            res.send(err);
        }
    });
});


// REQUEST SPECIFIC ROUTE

app.route("/articles/:articlesTitle")

    .get((req, res) => {

        Article.findOne({title: req.params.articlesTitle}, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found.");
            }
        });
    })

    .put((req, res) => {
        Article.replaceOne(
            {title: req.params.articlesTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err) => {
                if (!err) {
                    res.send("Successfully updated article!");
                } 
            }
        );
    })

    .patch((req, res) => {
        Article.updateOne(
            {title: req.params.articlesTitle},
            {$set: req.body},
            (req, res) => {
                if (!err) {
                    res.send("Successfully updated the article!");
                } else {
                    res.send(err);
                }
            }
        );
    })

    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (err) => {
                if (!err) {
                    res.send("Successfully deleted the article!");
                } else {
                    res.send(err);
                }
            }
        );
    });




// LISTEN TO 

app.listen(3000, (req, res) => {
    console.log("Server started on PORT 3000");
});


