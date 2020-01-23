const fs = require('fs');

let notes = [];
var lastId = 0;

init();
module.exports = function(app) {

  app.get("/api/notes", function(req, res) {
    res.json(notes);
  });

  app.post("/api/index", function(req, res) {
      req.body.id = parseInt(lastId);
      notes.push(req.body);
      writeToJsonFile(notes);
      res.json(true);
  });

  app.delete("/api/index/:id", function(req, res) {
     var filteredNotes = notes.filter(note => note.id !== parseInt(req.params.id)); 
     writeToJsonFile(filteredNotes);
     notes = filteredNotes;
     res.json(true);
 });

};

function init() {
     fs.readFile("./db/notes.json", "utf8", function (err, data) {
          if (err) {
               throw err;
          }
          let notesJSON = JSON.parse(data);
          notesJSON.forEach(function (note) {
               notes.push(note);
          });
          lastId = Math.max(...notes.map(obj => obj.id), 0) + 1;
     });
};

function writeToJsonFile(notes) {
     let notesJSON = JSON.stringify(notes, null, 2);
     fs.writeFile("./db/notes.json", notesJSON, function (err) {
          if (err) {
               throw err;
          }
     });
};
