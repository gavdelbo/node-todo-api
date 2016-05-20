var express = require('express');
var bodyParser = require('body-parser');

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
    var matchedTodo;
    
    todos.forEach( function(todo) {
        if (todoId === todo.id) {
            matchedTodo = todo;
        }
    });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// POST /todos route
app.post('/todos', function (req, res) {
   var body = req.body; 
   
   body.id  = todoNextId++;
   
   todos.push(body);
  
   res.json(body);
   
});


app.listen( PORT, function () {
    console.log('Express is listening on port ' + PORT + '!');
});