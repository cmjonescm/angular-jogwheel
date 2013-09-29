var express = require('express');
var fs = require('fs');

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.static(process.cwd()));

app.get('/', function (req, res) {
    fs.readFile(process.cwd() + '/views/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.listen(3000);