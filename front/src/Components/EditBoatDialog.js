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

function EditBoatDialog(props){
    // user pressed "update" button in the edit dialog
    const handleEditSubmitClick = ()=>{
        // close edit modal
        props.onClose();
        
        // send api request to udpate boat name
        axios.patch('/api/boat/'+props.editingCard.cardId, {newName:props.editingCard.name}).then((response) => {
            props.updateCardCallback();
        })
    }
      
    return <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Editing "{props.editingCard.id}" boat</DialogTitle>
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
                value={props.editingCard.name} onChange={props.handleEditChange}
            />
            </DialogContent>
            <DialogActions>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleEditSubmitClick}>Update</Button>
            </DialogActions>
        </Dialog>;
}

export default EditBoatDialog;