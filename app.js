const http = require('http');
const express = require('express');
const ejs = require('ejs');

const app = express();
const server = http.createServer(app);

const port = 5000;

app.set('views','./views');
app.set('view engine', 'ejs');

app.use(express.static('/assets'));
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('charts-chartjs');
//   res.render('index');
})

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

