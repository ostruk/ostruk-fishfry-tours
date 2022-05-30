const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const utils = require("./utils");
const DB = require('./db')
const app = express();
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db = new DB();
// CREATE new boat
app.post('/api/boat', (req, res) => {
	const boat = req.body;
	
	const isBoatValid = utils.boatValid(boat);
	if (!isBoatValid){
		res.status(500).send('Invalid boat data');
		return;
	}
	
	// check if boat with this name already exists
	
	if (db.boatExists(boat.name)){
		res.status(500).send('Boat with this name already exists');
		return;
	}
    db.boats.push(boat);

    res.send('Boat is added to the database');
});

// GET all boats
app.get('/api/boats', (req, res) => {
    res.json(db.boats);
});

// GET boat by name
app.get('/api/boat/:name', (req, res) => {
    // Reading id from the URL
    const name = req.params.name;

    // Searching boats for the name
    for (let boat of db.boats) {
        if (boat.name === name) {
            res.json(boat);
            return;
        }
    }

    // Sending 404 when not found
    res.status(404).send('Boat not found');
});

// DELETE boat
app.delete('/api/boat/:name', (req, res) => {
    // Reading name from the URL
    const name = req.params.name;

    // Remove item from the boats array
	let found = false;
    db.boats = db.boats.filter(i => {
        if (i.name !== name) {
            return true;
        }
		found = true;
        return false;
    });

	if (found){
		res.send('Boat deleted');
	}else{
		res.status(404).send('Boat not found');
	}
});

// PATCH (change) boat status or name
app.patch('/api/boat/:name', (req,res) =>{
	// Reading name from the URL
    const name = req.params.name;
	const newStatus = req.body.status;
    const newName = req.body.newName;
	
    // Find and update boat in the array
	let found = false;
    let foundBoat = null;
    for (let i = 0; i < db.boats.length; i++) {
        let boat = db.boats[i]
        if (boat.name === name) {
            foundBoat = boat;
			found = true;
        }
    }

    if (!found){
		res.status(404).send('Boat not found');
        return;
	}

    if (newStatus){
        if (['Docked','Outbound to Sea','Inbound to Harbor','Maintenance'].indexOf(newStatus)==-1){
            res.status(500).send('Invalid boat status');
            return;
        }
        foundBoat.status = newStatus;
    }

    if (newName){
        // check if boat with this name already exists
        if (db.boatExists(newName)){
            res.status(500).send('Boat with this name already exists');
            return;
        }
        foundBoat.name = newName;
    }

	res.send('Boat status updated');
});


// EDIT boat
app.post('/api/boat/:name', (req, res) => {
    // Reading name from the URL
    const name = req.params.name;
    const newBoat = req.body;

    // Find and update boat in the array
	let found = false;
    let foundI = -1;
    for (let i = 0; i < db.boats.length; i++) {
        let boat = db.boats[i]
        if (boat.name === name) {
            foundI = i;
			found = true;
        }
    }

	if (found){
        const isBoatValid = utils.boatValid(newBoat);
        if (!isBoatValid){
            res.status(500).send('Invalid boat data');
            return;
        }
        if (db.boatExists(newBoat.name)){
            res.status(500).send('Boat with this name already exists');
            return;
        }
        db.boats[foundI] = newBoat;
		res.send('Boat updated');
	}else{
		res.status(404).send('Boat not found');
	}
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../front/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'../front/build/index.html'));
});
	
module.exports = {api:app, db:db};