var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var bcrypt = require('bcryptjs');
var db = require('./db.js');

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

// GET /todos route with query ?completed=true
app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};
    
    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }
    
    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {
            $like: '%' + query.q + '%'
        };
    }
    
    db.todo.findAll({where: where}).then(function (todos) {
        res.json(todos);
    }, function (e) {
        res.status(500).send();
    });
    
    
    
    // var filteredTodos = todos;
    
    // if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    //     filteredTodos = _.where(filteredTodos, {completed: true});
    // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    //     filteredTodos = _.where(filteredTodos, {completed: false});
    // }
    // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0 ) {
    //     filteredTodos = _.filter(filteredTodos, function (todo) {
    //         return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
    //     });
    // }
    // res.json(filteredTodos);
});


// GET /todos/:id route
app.get('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    
    db.todo.findById(todoId).then(function (todo) {
            if (!!todo) {
                res.json(todo.toJSON());    
            } else {
                res.status(404).send();
            }
        }, function (e) {
            res.status(500).send(e);     
    });
    
   
    // use underscore .findWhere function to refactor
    // var matchedTodo = _.findWhere(todos, {id: todoId});
    
    // // todos.forEach( function(todo) {
    // //     if (todoId === todo.id) {
    // //         matchedTodo = todo;
    // //     }
    // // });
    // if (matchedTodo) {
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send();
    // }
});

// POST /todos route
app.post('/todos', function (req, res) {
   var body = _.pick(req.body, 'description', 'completed' ); 
   
   db.todo.create(body).then(function (todo) {
      res.json(todo.toJSON()); 
   }, function (e) {
      res.status(400).json(e); 
   });
   
//    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0 ) {
//        return res.status(400).send();
//    }
//    body.description = body.description.trim();
//    body.id  = todoNextId++;
//    todos.push(body);
//    res.json(body);
   
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    // use underscore .findWhere function to find id to delete
   // var matchedTodo = db.todos.findById(todoId); 
    
    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function (rowsDeleted) {
        if(rowsDeleted === 0) {
            res.status(404).json({
                error: 'No todo with id'
            });
        } else {
            res.status(204).send();
        }
    }, function () {
        res.status(500).send();
    });
});    

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed' ); 
    var attributes = {};
  
    
    if (body.hasOwnProperty('completed')) {
        attributes.completed  = body.completed;
    } 
    if (body.hasOwnProperty('description')) {
        attributes.description  = body.description;   
    } 
    
    db.todo.findById(todoId).then(function (todo) {
        if (todo) {
            todo.update(attributes).then(function(todo) {
                res.json(todo.toJSON());
            }, function (e) {
                res.status(400).json(e);
            });
        } else {
            res.status(500).send();
        }
    }, function () {
        res.status(500).send();
    });
});

// POST /users route
app.post('/users', function (req, res) {
   var body = _.pick(req.body, 'email', 'password' ); 
   
   db.user.create(body).then(function (user) {
      res.json(user.toPublicJSON()); 
   }, function (e) {
      res.status(400).json(e); 
   });
   
});

// POST /users/login route
app.post('/users/login', function (req, res) {
   var body = _.pick(req.body, 'email', 'password' ); 
  
    db.user.authenticate(body).then(function (user) {
        var token = user.generateToken('authentication');
        
        if (token) {
            res.header('Auth', token).json(user.toPublicJSON());   
        } else {
           res.status(401).send(); 
        }
        
    }, function () {
        res.status(401).send();
    });
   
});







db.sequelize.sync({force: true}).then(function () {
    app.listen( PORT, function () {
        console.log('Express is listening on port ' + PORT + '!');
    });    
});

