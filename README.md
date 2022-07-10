# Build-Your-Own-RESTful-API

This is a RESTful API exemple for beginners on programming. This is a wiki API, about some techs and tools that that i've learned through my courses.

## You'll need to:
```
1) Clone the project
2) Install Postman, MongoDB and StudioT3
3) Install express, body-parser, ejs and mongoose
```

## Example Documents
```
{
    "_id": "62c8777d33629c1e3f26ad61",
    "title": "JavaScript",
    "content": "JavaScript is a text-based programming language used both on the client-side and server-side that allows you to make web pages interactive."
}


{
    "_id" : ObjectId("5c1398aad79ac8eac11e7561"),
    "title" : "Bootstrap",
    "content" : "This is a framework developed by Twitter that contains pre-made front-end templates for web design"
}


{
    "_id": "62c72da1ef300d52b320832f",
    "title": "MongoDB",
    "content": "It is a noSQL database that uses JSON-like documents. It is good for working with large distributed datasets."
}


{
    "_id": "62c72d31ef300d52b320832b",
    "title": "Nodejs",
    "content": "It's an opensource environment where I can run js (Javascript) outside of the web. With node I can generate dynamic pages, I can add, delete, open files on the server as well as add, delete and modify data within a database."
}
```

## Server Starting Code

```

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
```
