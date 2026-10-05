const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080;
const db = new sqlite3.Database('./data/pets.db');

app.use(bodyParser.json());
app.use(express.static('public'));

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS pets (id INTEGER PRIMARY KEY, name TEXT, species TEXT, breed TEXT)");
});

app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/api/pets', (req, res) => {
  db.all("SELECT * FROM pets", [], (err, rows) => {
    res.json(rows || []);
  });
});

app.post('/api/pets', (req, res) => {
  const { name, species, breed } = req.body;
  db.run("INSERT INTO pets (name, species, breed) VALUES (?, ?, ?)", [name, species, breed], function(err) {
    res.json({ id: this.lastID });
  });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));