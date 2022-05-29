import React, { useState } from "react";
import axios from "axios";
import Board, { moveCard, removeCard, addCard } from '@asseinfo/react-kanban'

function EditCard(props){
    function handleEditCardSubmit(event){   
        axios.patch('http://localhost:3000/boat/'+props.editingCard.cardId, {newName:props.editingCard.name}).then((response) => {
            props.handleEditCard();
        })

        event.preventDefault();    
    }
      
    return <div>
            <h3>EDIT CARD</h3>
            <form onSubmit={handleEditCardSubmit}>
            <label>
                Name:
                <input type="text" value={props.editingCard.name} onChange={props.handleEditCardChange} />
            </label>
            <input type="submit" value="Submit" />
            </form>
        </div>;
}

export default EditCard;