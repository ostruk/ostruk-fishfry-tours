import React, { useState } from "react";
import axios from "axios";
import Board, { moveCard, removeCard, addCard } from '@asseinfo/react-kanban'

function AddCard(props){
    const [newBoatName, setNewBoatName] = useState("");

    function handleSubmit(event){
        axios.post('http://localhost:3000/boat',{name:newBoatName,status:'Docked'}).then((response)=>{
          props.addCardCallback(newBoatName);
        })
        setNewBoatName("");
        event.preventDefault();
    }

    function handleChange(event){
        setNewBoatName(event.target.value)
    }
      
    return <div>
                <h3>ADD CARD</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                    Name:
                    <input type="text" value={newBoatName} onChange={handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>;
}

export default AddCard;