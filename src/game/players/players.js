import React, { createRef, useEffect, useState } from "react";
import "./players.scss";
import Store from "../../DataStore";
import Name from "../../Name";
import firebase from "../../firebase";


function Players(props) {
  var [players, setPlayers] = useState([]);
  const [started,setStarted] = useState(false);
  //creating refs
  var refs = [];

  // const startTimer = (index) => {
  //   var timer = 0;
  //   // const progress = refs[index].current.getElementsByClassName("progress")[0];
  //   // progress.style.display = "block";
  //   // progress.style.width = timer + "px";
  //   // for (let i = 0; i < 38; i++) {
  //   //   //eslint-disable-next-line no-loop-func
  //   //   setTimeout(() => {
  //   //     progress.style.width = timer + "px";
  //   //     timer = timer + 10;
  //   //     if (timer === 380) {
  //   //       progress.style.display = "none";
  //   //       nextPlayer();
  //   //     }
  //   //   }, 1000 * i);
  //   console.log(refs);
  //   }

  useEffect(() => {
    firebase
      .firestore()
      .collection(Store.ROOM_ID)
      .doc(Name.PLAYERS)
      .onSnapshot((data) => {
        if(data.data()===undefined) return;
        var temp = data.data()[Name.USERS];
        temp.sort((a, b) => a[Name.NAME].localeCompare(b[Name.NAME]));
        var s = data.data()[Name.START];
        Store.IS_STARTED = s;
        Store.PLAYERS = temp;
        for(var m of temp) {
          if(m.name === Store.NAME) Store.IS_CURRENT_PLAYER = m[Name.CURRENT_PLAYER];
        }
        setPlayers(temp);
        setStarted(s);
      });
  }, []);

  const start = () => {
    if(Store.PLAYERS.length===1) {
      alert("one player can't play this game, please wait for other players to join");
      return;
    }
    firebase.firestore().collection(Store.ROOM_ID).doc(Name.PLAYERS)
    .update({start: true})
    .then(() => console.log("started"))
  }


  return (
    <div className="players">
      <h3>Players</h3>
      <div className="content">
        {players.map((player, i) => (
          <div
            ref={refs[i]}
            className={player.currentPlayer ? "item active" : "item"}
          >
            <div className="content">
              <div className="icon">
                <p>{player.name.charAt(0).toUpperCase()}</p>
              </div>
              <div className="name">
                <h3>{player.name}</h3>
                {player.lines === 0 ? (
                  <p>lines</p>
                ) : (
                  <p>{"BINGO".substr(0, player.lines)}</p>
                )}
              </div>
            </div>
            <p className="p">{player.currentNumber}</p>
            <div className="progress" />
          </div>
        ))}
      </div>
      {!started?(
        (Store.CREATOR ? (
          <div className="start" onClick={start}>
            <h5>click start to start the game</h5>
            <p>START</p>
          </div>
        ) : (<h5>wait for the room creator to start</h5>))
      ):(<h5>game started</h5>)}
    </div>
  );
}

export default Players;
