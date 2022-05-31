import React, { useState } from "react";
import ReactDOM from 'react-dom/client'
import axios from "axios";


import Board, { moveCard, removeCard, addCard } from '@asseinfo/react-kanban'
import '@asseinfo/react-kanban/dist/styles.css'
import {getColumnIndexFromName} from '../utils/utils'
import Card from './Card'
import ColumnTitle from './ColumnTitle'
import NewBoatDialog from './NewBoatDialog'
import EditBoatDialog from './EditBoatDialog'

function MyBoard(props){
      
    // iniitial board with empty columns, to be populated later
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
    
    // Control the state of the board
    const [controlledBoard, setBoard] = useState(null);

    // Retreive board state from the server
    React.useEffect(() => {
    axios.get('/api/boats').then((response) => {
        // parse response into format compatible with the board component
        let data = response.data;
        data.forEach(function(boat) { 
        // find which column this boat belongs to
        let columnIndex = getColumnIndexFromName(boat.status);
        // push boat into appropriate column
        board.columns[columnIndex].cards.push({id:boat.name,title:boat.name,status:boat.status});
        })
        // update board state with populated board
        setBoard(board);
    });
    }, []);

    // hook for card move event issued by kanban library
    // - send api request to change boat status and update board
    function handleCardMove(_card, source, destination) {
        // update board state - call moveCard utility function from the kanban library
        const updatedBoard = moveCard(controlledBoard, source, destination);
        // update internal properties of that specific card
        // find column to which this item belongs
        let columnIndex = destination.toColumnId-1;
        let column = updatedBoard.columns[columnIndex];

        // find card in the column
        let card = column.cards.find(x => x.id === _card.id);
        card.status = updatedBoard.columns[columnIndex].title;

        setBoard(updatedBoard);

        // get the column name tow hich we are moving the boat
        let moveToId = controlledBoard.columns.find(x => x.id === destination.toColumnId).title;
        // send api request to move the boat
        axios.patch('/api/boat/'+_card.id, {status:moveToId}).then((response) => {})
    }

    // handle "delete" button click from the menu for individual boat
    function handleCardRemove(card,a,b){
    // send api request to delete this boat
    axios.delete('/api/boat/'+card.id).then((response) => {
        // update UI after receving success response from the server
        // find column to which this card belongs
        let status = card.status;
        let columnIndex = getColumnIndexFromName(status);
        let column = board.columns[columnIndex];
        // call removeCard utility function from the kanban board library
        const updatedBoard=removeCard(controlledBoard,column,card);
        // update board state with removed item
        setBoard(updatedBoard);
    });
    }

    // NEW MODAL
    const [newBoatDialogOpen, setNewBoatDialogOpen] = useState(false);

    // handle big "+" button click
    const handleAddClick = () => {
        setNewBoatDialogOpen(true);
    };

    // handle closure of the new boat dialog
    const handleNewBoatDialogClose = () => {
        setNewBoatDialogOpen(false);
    };
    
    function addCardCallback(newBoatName){
        // update board state with new boat - use addCard utlity function from the kanban board library
        const updatedBoard=addCard(controlledBoard,board.columns[0],{id:newBoatName,title:newBoatName,status:'Docked'});
        setBoard(updatedBoard);
    }

    // EDIT MODAL
    const [editBoatDialogOpen, setEditBoatDialogOpen] = useState(false);
    const [editingCard, setEditingCard] = useState({"cardId":null,"name":"","status":"","id":""});

     // handle closure of the edit dialog
    const handleEditModalClose = () => {
        setEditBoatDialogOpen(false);
    };

    // handle click of "edit" button from the card menu
    function handleCardEdit(card){
        // set model for the card being edited
        setEditingCard({"cardId":card.id,"name":card.id,"status":card.status,"id":card.id});
        // show edit modal
        setEditBoatDialogOpen(true);
    }

    // update model when user is typing new name for boat being edited
    function handleEditChange(event){
        setEditingCard({...editingCard, "name":event.target.value});
    }

    function updateCardCallback(){
        // make copy so ui updates
        let updatedBoard = {...controlledBoard};
            
        // find column to which this item belongs
        let columnIndex = getColumnIndexFromName(editingCard.status);
        let column = updatedBoard.columns[columnIndex];

        // find card in the column
        let card = column.cards.find(x => x.id === editingCard.cardId);

        // change card name
        card.title=editingCard.name;
        card.id = editingCard.name;

        // update board
        setBoard(updatedBoard);

        // blank editing state
        setEditingCard({"cardId":null,"name":"","status":"","id":""});
    }

    if (!controlledBoard) {
        return null; // render only once we retreived data from the API
    };

    return <div>
        <Board onCardDragEnd={handleCardMove} disableColumnDrag
            renderCard={({title, status}) => (
            <Card title={title} status={status} handleCardRemove={handleCardRemove} handleCardEdit={handleCardEdit}></Card>
            )}
            renderColumnHeader={({ title }) => (
            <ColumnTitle title={title} handleAddClick={handleAddClick}></ColumnTitle>
            )}
        >
            {controlledBoard}
        </Board>
      
      

      <NewBoatDialog open={newBoatDialogOpen} onClose={handleNewBoatDialogClose} addCardCallback={addCardCallback}></NewBoatDialog>
      <EditBoatDialog open={editBoatDialogOpen} onClose={handleEditModalClose} addCardCallback={addCardCallback}
       handleEditChange={handleEditChange} editingCard={editingCard} updateCardCallback={updateCardCallback}></EditBoatDialog>
      
    </div>;
}

export default MyBoard;