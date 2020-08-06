// defining stuff
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 8080;
const mainDir = path.join(__dirname,'/public');
//EXPRESS section
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
//GET functions
app.get('/notes',function(req,res){
    res.sendFile(path.join(mainDir,'notes.html'));
});
app.get('/api/notes',function(req,res){
    res.sendFile(path.join(__dirname,'/db/db.json'));
});
app.get('/api/notes/:id',function(req,res){
    var saved = JSON.parse(fs.readFileSync('./db/db.json','utf8'));
    res.json(saved[Number(req.params.id)]);
});
app.get('*',function(req,res){
    res.sendFile(path.join(mainDir,'index.html'));
});
// POST function
app.post('/api/notes',function(req,res){
    var saved = JSON.parse(fs.readFileSync('./db/db.json','utf8'));
    var newT = req.body;
    var uId = (saved.length).toString();
    newT.id = uId;
    saved.push(newT);
    fs.writeFileSync('./db/db.json',JSON.stringify(saved));
    console.log('Note has been saved. It states: ', newT);
    res.json(saved);
});
//DELETE function
app.delete('/api/notes/:id',function(req,res){
    var saved = JSON.parse(fs.readFileSync('./db/db.json','utf8'));
    var noteId = req.params.id;
    var nId = 0;
    console.log(`DELETING THIS NONESSENTIAL NOTE WITH THE ID ${noteId}`);
    saved = saved.filter(disNote => {
        return disNote.id != noteId;
    })
    for (disNote of saved) {
        disNote.id = nId.toString();
        nId++;
    }
    fs.writeFileSync('./db/db.json',JSON.stringify(saved));
    res.json(saved);
});
// PORT call section
app.listen(port,function(){
    console.log(`Listening on port ${port}.`);
});