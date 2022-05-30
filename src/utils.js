function boatValid(boat){
	// Checks if boat object is valid
	// - must contain "name"
	// - must contain "status"
	// - status must be one of 'Docked','Outbound to Sea','Inbound to Harbor','Maintenance'
	// RETURNS: true if valid, false if invalid
	// check that boat name and boat status are present
	if (!boat.name || !boat.status){
		return false;
	}
	
	// check that boat status is valid
	if (['Docked','Outbound to Sea','Inbound to Harbor','Maintenance'].indexOf(boat.status)==-1){
		return false;
	}
	
	return true;
}

exports.boatValid = boatValid;