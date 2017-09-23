var express = require('express');

var app = express();

app.use('/todomvc', express.static('todomvc'));
app.use('/src', express.static('src'));

app.listen(8000, () => {
  console.log('Lingu server online'); //eslint-disable-line
});

