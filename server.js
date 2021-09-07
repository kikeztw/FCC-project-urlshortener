require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./bd');

// Basic Configuration
const port = process.env.PORT || 3000;

const collection = db.collection("Urls", {capped: true, size: 20});

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/test-create', (req, res) => {
  collection.insert([{
    _id: 1,
    name: 'test'
  }])
  res.json({ success: 'success' });
})

app.get('/read', (req, res) => {
  const response = collection.find({}, {
    $page: 0,
    $limit: 10
  })
  console.log(response);
  res.json({ success: JSON.stringify(response) });
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
