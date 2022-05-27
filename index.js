// TODO: break into multiple files

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

let boats = []; // IN MEM DATABASE, TODO: REPLACE WITH ACTUAL DB

const utils = require("./utils");

// CREATE new boat
app.post('/boat', (req, res) => {
	const boat = req.body;
	
	const isBoatValid = utils.boatValid(boat);
	if (!isBoatValid){
		res.status(500).send('Invalid boat data');
		return;
	}
	
	// check if boat with this name already exists
	let found = false;
	for (let b of boats) {
        if (b.name === boat.name) {
            found = true;
        }
    }
	
	if (found){
		res.status(500).send('Boat with this name already exists');
		return;
	}
    boats.push(boat);

    res.send('Boat is added to the database');
});

// GET all boats
app.get('/boats', (req, res) => {
    res.json(boats);
});

// GET boat by name
app.get('/boat/:name', (req, res) => {
    // Reading id from the URL
    const name = req.params.name;

    // Searching boats for the name
    for (let boat of boats) {
        if (boat.name === name) {
            res.json(boat);
            return;
        }
    }

    // Sending 404 when not found
    res.status(404).send('Boat not found');
});

// DELETE boat
app.delete('/boat/:name', (req, res) => {
    // Reading name from the URL
    const name = req.params.name;

    // Remove item from the boats array
	let found = false;
    boats = boats.filter(i => {
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

// PATCH (change) boat status
app.patch('/boat/:name', (req,res) =>{
	// Reading name from the URL
    const name = req.params.name;
	const newStatus = req.body.status;
	
	if (['Docked','Outbound to Sea','Inbound to Harbor','Maintenance'].indexOf(newStatus)==-1){
		res.status(500).send('Invalid boat status');
		return;
	}
	
	// Find and update boat in the array
	let found = false;
    for (let i = 0; i < boats.length; i++) {
        let boat = boats[i]
        if (boat.name === name) {
            boats[i].status = newStatus;
			found = true;
        }
    }
	
	if (found){
		res.send('Boat status updated');
	}else{
		res.status(404).send('Boat not found');
	}
	
});


// EDIT boat
app.post('/boat/:name', (req, res) => {
    // Reading name from the URL
    const name = req.params.name;
    const newBoat = req.body;

    // Find and update boat in the array
	let found = false;
    for (let i = 0; i < boats.length; i++) {
        let boat = boats[i]
        if (boat.name === name) {
            boats[i] = newBoat;
			found = true;
        }
    }

	if (found){
		res.send('Boat updated');
	}else{
		res.status(404).send('Boat not found');
	}
});

app.listen(PORT, () => console.log(`Fishfry Tours API is now listening on port ${port}!`))