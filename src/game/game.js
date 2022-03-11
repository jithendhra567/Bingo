import React, { useState } from "react";
import Players from "./players/players";
import Board from "../board/board";
import Chat from "./chat/chat";
import { useHistory } from "react-router-dom";
import "./game.scss";
import Store from "../DataStore";
import firebase from "../firebase";
import Name from "../Name";
function Game(props) {
  //stopping from reloading
  // var history = useHistory();
  // const checkReload = () => {
  //   var state = window.history.state || {};
  //   var reloadCount = state.reloadCount || 0;
  //   if (performance.navigation.type === 1) {
  //     // Reload
  //     state.reloadCount = ++reloadCount;
  //     window.history.replaceState(state, null, document.URL);
  //   } else if (reloadCount) {
  //     delete state.reloadCount;
  //     window.history.replaceState(state, null, document.URL);
  //   }
  //   if (reloadCount) {
  //     var x = window.confirm("sorry! your lost");
  //     if (Store.ROOM_ID !== "") {
  //       firebase
  //         .firestore()
  //         .collection(Store.ROOM_ID)
  //         .doc(Name.PLAYERS)
  //         .get()
  //         .then((data) => {
  //           var x = data.data()[Name.USERS];
  //           var index = 0;
  //           for (var i of x) {
  //             if (i[Name.NAME] === Store.NAME) index = x.indexOf(i);
  //           }
  //           x.splice(index, 1);
  //           firebase
  //             .firestore()
  //             .collection(Store.ROOM_ID)
  //             .doc(Name.PLAYERS)
  //             .update({ users: x });
  //         });
  //     }
  //     history.push("/");
  //   }
  // };

  return (
    <div className="game">
      <Players />
      <Board array={props.array} roomId={Store.ROOM_ID} />
      <Chat />
    </div>
  );
}

export default Game;
