var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app =  express();
var PORT = process.env.PORT || 3000;

// Todos collection
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

//home route
app.get('/', function(req, res) {
    res.send('Homepage');
});

// GET /todos route
app.get('/todos', function (req, res) {
    res.json(todos);
});
// GET /todos/:id route
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    // use underscore .findWhere function to refactor
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    // todos.forEach( function(todo) {
    //     if (todoId === todo.id) {
    //         matchedTodo = todo;
    //     }
    // });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// POST /todos route
app.post('/todos', function (req, res) {
   var body = _.pick(req.body, 'description', 'completed' ); 
   
   if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ) {
       return res.status(400).send();
   }
   body.description = body.description.trim();
   body.id  = todoNextId++;
   todos.push(body);
   res.json(body);
   
});
// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    // use underscore .findWhere function to find id to delete
    var matchedTodo = _.findWhere(todos, {id: todoId}); 
    
    if (!matchedTodo) {
        res.status(404).json({"error": "No todo found with that id"});
    } else {
       todos = _.without(todos, matchedTodo); 
       res.json(matchedTodo);
    }
});
app.listen( PORT, function () {
    console.log('Express is listening on port ' + PORT + '!');
});