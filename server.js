let express = require('express');
let bodyParser = require('body-parser');
let MongoClient = require('mongodb').MongoClient;
let ObjectID = require('mongodb').ObjectID;

let app = express();
let db;

const url = 'mongodb://localhost:27017';
const dbName = 'weatherApp';
const client = new MongoClient(url);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/cities', (req, res) => {
  db.collection('cities').find().toArray((err, docs) => {
      if(err) {
          console.log(err);
          return res.sendStatus(500);
      }
      res.send(docs);
  })
});

app.get('/cities/:id', (req, res) => {
   db.collection('cities').findOne({_id: ObjectID(req.params.id)}, (err, docs) => {
       if(err) {
          console.log(err);
          return res.sendStatus(500);
       }
       res.send(docs);
   });
  
});

app.post('/cities', (req, res) => {
  let city = {
      id: Date.now(),
      name: req.body.name
  }
  
  db.collection('cities').insertOne(city, (err, result) => {
      if(err) {
          console.log(err);
          return res.sendStatus(500);
      }
  })

  res.send(city);
});

app.put('/cities/:id', (req, res) => {
  db.collection('cities').updateOne({_id: ObjectID(req.params.id)}, {$set: {name: req.body.name}}, (err, result) => {
      if(err) {
          console.log(err);
          return res.sendStatus(500);
      }
  })
  res.sendStatus(200);
});

app.delete('/cities/:id', (req, res) => {
  db.collection('cities').deleteOne({_id: ObjectID(req.params.id)}, (err, result) => {
      if(err) {
          console.log(err);
          return res.sendStatus(500);
      }
  })
  res.sendStatus(200);
});



client.connect(function(err) {
  console.log('Connected succesfully to server...');

  db = client.db(dbName);
  app.listen(3333, () => console.log('API started'));
})

