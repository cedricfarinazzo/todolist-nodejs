var express = require('express');
var url = require('url');

var app = express();
var session = require('cookie-session'); // Charge le middleware de sessions
var bodyParser = require('body-parser'); // Charge le middleware de gestion des paramètres
var urlencodedParser = bodyParser.urlencoded({ extended: false });


app.use(session({
        name: '_auth',
        secret: 'todo_auth',
        saveUninitialized: true,
}))

.use(function(req, res, next) {
    var page = url.parse(req.url).pathname;
    console.log(page);
    next();
})

.use(function(req, res, next) {
    if (typeof(req.session.todo) == 'undefined')
    {
        req.session.todo = [];
    }
    next();
})

.get("/", function(req, res) {
    res.render("index.ejs", {todo: req.session.todo});
})

.post("/add", urlencodedParser, function(req, res) {
    var task = req.body.task;
    if (typeof(task) == 'string' && task != "")
    {
        req.session.todo.push(task);
    }
    res.redirect("/");

})

.get("/del/:id", function(req, res) {
    var id = parseInt(req.params.id);
    if (!isNaN(id) && (0 <= id && id <= req.session.todo.length))
    {
        req.session.todo.pop(id);
    }
    res.redirect("/");
})

.use(function(req, res) {
    res.redirect("/");
})
.listen(8080);
