import React from 'react';
import './instructions.scss'
function Instructions(props) {
    return (
        <div className="instructions">
            <div className="head"><h3>Instructions</h3></div>
            <p>1.  This is a BINGO multiplayer game. where many players can play in room</p>
            <p>1.  Users may create room or join room using room id (you can get room id from the player who created the room)</p>
            <p>1.  The room creator can only start the game in the room</p>
            <p>1.  user can chat to people in the room</p>
            <h4>Rules:</h4>
            <p>1. The game Board will look like 2D grid (5x5) which is on right side</p>
            <p>2. players will click the number one by one</p>
            <p>3. There is card which represents the current player to select the number one</p>
            <p>4. select numbers will form some lines if the lines are equals or greater than 5 then the player is the winner</p>
        </div>
    );
}

export default Instructions;