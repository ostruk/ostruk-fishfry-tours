import React, { useState } from "react";
import axios from "axios";
import Board, { moveCard, removeCard, addCard } from '@asseinfo/react-kanban'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function NewBoatDialog(props){
    // NEW BOAT DIALOG
    const [newBoatName, setNewBoatName] = useState("");
    
    // handle "add" click in the new boat dialog
    const handleAddSubmitClick = ()=>{
        // close the dialog
        props.onClose();
        
        // send request to api to add new boat
        axios.post('/api/boat',{name:newBoatName,status:'Docked'}).then((response)=>{
            // update board state with new boat - use addCard utlity function from the kanban board library
            props.addCardCallback(newBoatName);
            
        })

        // clear form so next time it's open text field is empty
        setNewBoatName("");
    }

    // update model when user types new boat name
    function handleNewBoatNameChange(event){
        setNewBoatName(event.target.value)
    }
      
    return <Dialog open={props.open} onClose={props.onClose}>
                <DialogTitle>Add new boat</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Please enter boat name, it must be unique
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="boatName"
                    label="Boat Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newBoatName} onChange={handleNewBoatNameChange}
                    inputProps={{"data-testid":"new-boat-input"}}
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleAddSubmitClick} data-testid="add-new-boat-button">Add</Button>
                </DialogActions>
            </Dialog>;
}

export default NewBoatDialog;