const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

app.use(bodyParser.json());
app.use(
  morgan(":method :url :body :status :res[content-length] - :response-time ms")
);
app.use(cors());
app.use(express.static("build"));

app.get("/api/persons", (req, res) => {
  Person.find({}).then(people => {
    res.json(people.map(Person.format));
  });
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id)
    .then(result => {
      res.json(Person.format(result));
    })
    .catch(error => {
      res.status(404);
      res.json({ error: "Person not found" });
    });
});

app.put("/api/persons/:id", (req, res) => {
  const body = req.body;

  const person = {
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(Person.format)
    .then(result => {
      res.json(result);
    })
    .catch(error => {
      res.status(404);
      res.json({ error: "Person not found" });
    });
});

app.post("/api/persons", (req, res) => {
  const personData = req.body;
  if (typeof personData.name === "undefined" || personData.name.length === 0) {
    res.status(400);
    res.json({ error: "Person name missing" });
    return;
  }
  if (typeof personData.number === "undefined" || personData.number.length === 0) {
    res.status(400);
    res.json({ error: "Person number missing" });
    return;
  }

  const person = new Person(personData);
  person.save()
    .then(Person.format)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      res.status(400);
      res.json({ error: 'Failed to add person'});
    });
});

app.delete("/api/persons/:id", (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      res.status(400).send({ error: 'Failed to delete person' })
    })
});

app.get("/info", (req, res) => {
  Person.count({}, function( err, count){
    res.send(`Tietokannassa ${count} nimeä`);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
