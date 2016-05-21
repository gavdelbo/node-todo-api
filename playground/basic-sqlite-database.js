var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
   'dialect': 'sqlite',
   'storage': __dirname + '/basic-sqlite-database.sqlite' 
});

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})


sequelize.sync().then(function () {
    console.log('Everythig is synced');
   
    Todo.findById(33).then(function (todo) {
        if (todo) {
            console.log(todo.toJSON());
        } else {
            console.log('Todo not found');
        }
        
    });
    
//     Todo.create({
//         description: 'Go to gym',
//         completed: true
//     }).then(function (todo) {
//         return Todo.create({
//             description: "Go Shopping"
//         });
//     }).then(function () {
//         return Todo.findAll({
//             where: {
//                 completed: false
//             }
//         });
//     }).then(function (todos) {
//         if (todos) {
//             todos.forEach(function (todo){
//                 console.log(todo.toJSON());
//             })
//         } else {
//             console.log('no todo found!');
//         }
//     }).catch(function (e) {
//         console.log(e);
//     });    
 });