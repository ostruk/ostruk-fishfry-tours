import React, { useState } from "react";
import ReactDOM from 'react-dom/client'
import axios from "axios";

import './App.css';

import Board, { moveCard, removeCard, addCard } from '@asseinfo/react-kanban'
import '@asseinfo/react-kanban/dist/styles.css'

import AddCard from './Components/AddCard'
import EditCard from './Components/EditCard'
import Card from './Components/Card'
import ColumnTitle from './Components/ColumnTitle'
import Fab from '@mui/material/Fab';
import Icon from '@mui/material/Icon';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';




function ControlledBoard() {
  const board = {
      columns: [
        {
          id: 1,
          title: "Docked",
          cards: [
            // {
            //   id: 1,
            //   title: "Card title 1",
            //   description: "Card content"
            // }
            // {
            //   id: 2,
            //   title: "Card title 2",
            //   description: "Card content"
            // }
          ]
        },
        {
          id: 2,
          title: "Outbound to Sea",
          cards: [
          
          ]
        },
        {
          id: 3,
          title: "Inbound to Harbor",
          cards: [
            
          ]
        },
        {
          id: 4,
          title: "Maintenance",
          cards: [
          
          ]
        }
      ]
    };
    
  // You need to control the state yourself.
  const [controlledBoard, setBoard] = useState(null);
  

  // Retreive board state from the server
  React.useEffect(() => {
    axios.get('http://localhost:3000/boats').then((response) => {
      // parse response into format compatible with the board component
      let data = response.data;
      data.forEach(function(boat) { 
        let columnIndex = getColumnIndexFromName(boat.status);
        board.columns[columnIndex].cards.push({id:boat.name,title:boat.name,status:boat.status});
       })
      setBoard(board);
    });
  }, []);

  function getColumnIndexFromName(name){
    switch(name){
      case "Docked":
        return 0;
      case "Outbound to Sea":
        return 1;
      case "Inbound to Harbor":
        return 2;
      case "Maintenance":
        return 3;
    }
  }

  function handleCardMove(_card, source, destination) {
    // console.log('handleCardMove: ', destination);
    let moveToId = controlledBoard.columns.find(x => x.id === destination.toColumnId).title;
    const updatedBoard = moveCard(controlledBoard, source, destination);
    setBoard(updatedBoard);

    // console.log('moveToId: ', moveToId);
    axios.patch('http://localhost:3000/boat/'+_card.id, {status:moveToId}).then((response) => {
      
    })
  }

  function handleCardRemove(card,a,b){
    // find column to which this card belongs
    let status = card.status;
    let columnIndex = getColumnIndexFromName(status);
    let column = board.columns[columnIndex];
    axios.delete('http://localhost:3000/boat/'+card.id).then((response) => {
      const updatedBoard=removeCard(controlledBoard,column,card);
      setBoard(updatedBoard);
    });
  }

  function addCardCallback(newBoatName){
    const updatedBoard=addCard(controlledBoard,board.columns[0],{id:newBoatName,title:newBoatName,status:'Docked'});
    setBoard(updatedBoard);
  }

  const [open, setOpen] = useState(false);

  const handleAddClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleAddSubmitClick = ()=>{
    handleClose();
    axios.post('http://localhost:3000/boat',{name:newBoatName,status:'Docked'}).then((response)=>{
      addCardCallback(newBoatName);
    })
    setNewBoatName("");
  }

  function handleChange(event){
    setNewBoatName(event.target.value)
  }

  // EDIT MODAL

  function handleCardEdit(card){
    setEditingCard({"cardId":card.id,"name":card.id,"status":card.status,"id":card.id});
    setEditOpen(true);
  }

  function handleEditCardChange(event){
    setEditingCard({"cardId":editingCard.cardId,"name":event.target.value,"status":editingCard.status,"id":event.target.value})
  }

  function handleEditCard(){
    let updatedBoard = {...board};
    let columnIndex = getColumnIndexFromName(editingCard.status);
    let column = updatedBoard.columns[columnIndex];
    let card = column.cards.find(x => x.id === editingCard.cardId);
    card.title=editingCard.name;
    card.id = editingCard.name;
    setBoard(updatedBoard);
    setEditingCard({"cardId":null,"name":"","status":"","id":""});
  }

  const [modalOpen, setEditOpen] = useState(false);

  const handleEditClick = () => {
    setEditOpen(true);
  };

  const handleModalClose = () => {
    setEditOpen(false);
  };

  const [editingCard, setEditingCard] = useState({"cardId":null,"name":"","status":"","id":""});
  const [newBoatName, setNewBoatName] = useState("");

  const handleEditSubmitClick = ()=>{
    handleModalClose();
    axios.patch('http://localhost:3000/boat/'+editingCard.cardId, {newName:editingCard.name}).then((response) => {
        handleEditCard();
    })
  }

  function handleEditChange(event){
    // setNewBoatName(event.target.value)
    handleEditCardChange(event);
  }

  if (!controlledBoard) {
    // console.log("NO DAT");
    return null
    
  };
  // console.log("RENDER");

  return (
    <div>
       <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Icon
              style={{"fontSize":"3.2em"}}
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              sailing
            </Icon>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              Fishfry Tours
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      
      <Board onCardDragEnd={handleCardMove} disableColumnDrag
        renderCard={({title, status}) => (
          <Card title={title} status={status} handleCardRemove={handleCardRemove} handleCardEdit={handleCardEdit}></Card>
        )}
        renderColumnHeader={({ title }) => (
          <ColumnTitle title={title}></ColumnTitle>
        )}
        >

        {controlledBoard}
      </Board>
      
      <Fab color="warning" aria-label="add" id="add-button" onClick={handleAddClick}>
        <Icon>add</Icon>
      </Fab>

      <Dialog open={open} onClose={handleClose}>
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
            value={newBoatName} onChange={handleChange}
            inputProps={{"data-testid":"new-boat-input"}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddSubmitClick} data-testid="add-new-boat-button">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={modalOpen} onClose={handleModalClose}>
          <DialogTitle>Editing "{editingCard.id}" boat</DialogTitle>
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
              value={editingCard.name} onChange={handleEditChange}
          />
          </DialogContent>
          <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleEditSubmitClick}>Update</Button>
          </DialogActions>
      </Dialog>

      </div>
  );
}

function App() {
  return (
    <ControlledBoard />
  );
}

export default App;