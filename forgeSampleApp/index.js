var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules/@adsk/forge-hfdm/lib/browser'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
