const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/event_tasks', { useNewUrlParser: true });

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', TaskSchema);

app.use(express.static( __dirname + '/public/dist/public' ));

// GET: Retrieve all Tasks
app.get('/tasks', function(req, res){
    Task.find({}, function(err, tasks){
        if(err){
            console.log('*********************');
            console.log('Returned Error: ', err);
            res.json({message: 'Error', error: err})
        }
        else {
           res.json({message: 'All Tasks:', data: tasks})
        }
     });
});

// GET: Retrieve a Task by ID
app.get('/:id', function(req, res){
    Task.findOne({ _id: req.params.id }, function(err, task){
        if (err) {
            console.log('*********************');
            console.log('Returned Error: ', err);
            res.json({message: 'Error', error: err})
        }
        else {
            res.json({message: 'Task:', data: task})
        }
    });
});

// POST: Create a Task
app.post('/tasks', function(req, res){
    var newTask = new Task();
    newTask.title = req.body.title;
    newTask.description = req.body.description;
    newTask.completed = req.body.completed;
    newTask.save(function(err, task){
        if (err) {
            console.log('*********************');
            console.log('Returned Error: ', err);
            res.json({message: 'Error', error: err})
        }
        else {
            res.json({message: 'New Task:', data: task})
        }
    });
});

// PUT: Update a Task by ID
app.put('/tasks/:id', function(req, res){
    Task.findOneAndUpdate({ _id: req.params.id }, { title: req.body.title, description: req.body.description }, function (err, task) {
        if (err) {
            console.log('*********************');
            console.log('Returned Error: ', err);
            res.json({message: 'Error', error: err})
        }
        else {
            res.json({message: 'Updated Task:', data: task})
        }
    });
});

// DELETE: Delete a Task by ID
app.delete('/tasks/:id/', function(req, res){
    Task.remove({ _id: req.params.id }, function(err){
        if (err) {
            console.log('*********************');
            console.log('Returned Error: ', err);
            res.json({message: 'Error', error: err})
        }
        else {
            Task.find({}, function(err, tasks){
                if(err){
                    console.log('*********************');
                    console.log('Returned Error: ', err);
                    res.json({message: 'Error', error: err})
                }
                else {
                   res.json({message: 'Deletion Successful:', data: tasks})
                }
            });
        }
    });
});

app.listen(8000, function () {
    console.log('listening on port 8000');
});