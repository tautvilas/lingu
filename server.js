var express = require('express');

var app = express();

app.use('/todomvc', express.static('todomvc'));
app.use('/src', express.static('src'));
app.use('/lib', express.static('lib'));

app.listen(8000, () => {
  console.log('Lingu server online on localhost:8000'); //eslint-disable-line
});

