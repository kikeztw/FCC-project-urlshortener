require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const uniqid = require('uniqid'); 
const ForerunnerDB = require("forerunnerdb");
const validUrl = require('valid-url');


// setup database
const fdb = new ForerunnerDB();

const db = fdb.db("FCCCourse");
const collection = db.collection("Urls", {capped: true, size: 20});

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded());
app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// routes here
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  if(!validUrl.isWebUri(url)){
    res.json({ error: 'invalid url' });
  }else{
    const _id = uniqid();
    const code = uniqid.time();
    collection.insert([{
      _id,
      url,
      code
    }])
    res.json({ 
      original_url: url,
      short_url: code
    });
  }
})

app.get('/find', (req, res) => {
  const code = req.query.code || '';
  const result = collection.find({
    code:{
      $eeq: code,
    }
  })
  res.json({ success: JSON.stringify(result) });
})

app.get('/api/shorturl/:code?', (req, res) => {
  const code = req.params.code || '';
  const result = collection.find({
    code:{
      $eeq: code,
    }
  })

  if(result?.length){
    const record = result[0];
    const url = record.url;
    res.redirect(url);
  }else{
    res.status(500).json('Url not found')
  }
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
