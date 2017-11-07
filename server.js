var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
mongoose = require('mongoose'),
bodyParser = require('body-parser');

//mongoose instance connection url connection
/*mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/StudentManagement', { useMongoClient: true });*/


app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

var route = require('./api/routes/wordRoute');//importing route
route(app); //register the route

app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: __dirname
    });
});



app.listen(port);

console.log('RESTful API server started on: ' + port);