var express = require('express');
var app =  express();
var PORT = process.env.PORT || 3000;


// Todos collection
var todos = [{
    id: 1,
    description: 'Meet for lunch',
    completed: false
}, {
    id: 2,
    description: 'Go shopping',
    completed: false
}, {
    id: 3,
    description: 'Got to gym',
    completed: false
}];

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




app.listen( PORT, function () {
    console.log('Express is listening on port ' + PORT + '!');
});