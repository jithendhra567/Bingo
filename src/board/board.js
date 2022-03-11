import React, { createRef, useEffect } from "react";
import "./board.scss";
import firebase from "../firebase";
import Store from "../DataStore";
import Name from "../Name";
import { useHistory } from "react-router-dom";
function Square(props) {
  const sqRef = createRef();
  const pRef = createRef();
  const onTouch = () => {
    if (!Store.IS_STARTED || !Store.IS_CURRENT_PLAYER) return;
    if (pRef.current.style.color === "#fff") return;
    sqRef.current.style.backgroundColor = "#4393ee";
    pRef.current.style.color = "#fff";
    props.click();
  };
  return (
    <div
      className="square"
      id={props.value}
      ref={sqRef}
      onClick={onTouch}
      key={props.value}
    >
      <p ref={pRef}>{props.value}</p>
    </div>
  );
}

function Board(props) {
  const history = useHistory();
  //creating 1d square matrix to create Dynamic Layout
  const x = [0, 1, 2, 3, 4];
  //getting Title Reference
  const refArray = props.array;
  var prevLines = 0; //track the lines
  const arrColors = ["#ff4b2b", "#20c997", "#845ef7", "#339af0", "#f06595"];

  //pushing 25 numbers in values array in random order
  var values = [];
  var generatedValues = [];
  var tickedValues = [];
  const getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };
  for (var i = 1; i <= x.length * x.length; i++) values.push(i);
  const getValue = () => {
    var rand = getRandomInt(values.length);
    var x = values[rand];
    values.splice(rand, 1);
    generatedValues.push(x);
    tickedValues.push(false);
    return x;
  };

  // square click handler
  const onTouch = (i) => {
    if (tickedValues[i]) return;
    tickedValues[i] = true;
    Store.update();
    if (Store.LINES > 0) {
      for (var m = prevLines; m < Store.LINES && m < 5; m++)
        refArray[m].current.style.color = arrColors[m];
      prevLines = Store.LINES;
    }
    var players = [...Store.PLAYERS];
    var index = 0;
    for (var x in players) {
      if (players[x][Name.NAME] === Store.NAME) index = x;
    }
    nextPlayer(players, +index, i);
  };

  const nextPlayer = (players, current, i) => {
    var next = 0;
    if (current + 1 === players.length) next = 0;
    else next = current + 1;
    players[current].currentPlayer = false;
    players[next].currentPlayer = true;
    players[current][Name.LINES] = Store.LINES;
    players[current][Name.CURRENT_NUMBER] = Store.BOARD[i];
    Store.CURRENT_NUMBER = Store.BOARD[i];
    firebase
      .firestore()
      .collection(Store.ROOM_ID)
      .doc(Name.WINNER)
      .set({ number: Store.BOARD[i] });
    firebase
      .firestore()
      .collection(Store.ROOM_ID)
      .doc(Name.PLAYERS)
      .update({ users: players })
      .then(() => {
        console.log(Store.LINES);
        if (Store.LINES >= 5) {
          firebase
          .firestore()
          .collection(Store.ROOM_ID)
          .doc(Name.WINNER)
          .set({ number: 0, winner: Store.NAME });
        }
      });
    Store.IS_CURRENT_PLAYER = false;
  };

  useEffect(() => {
    Store.BOARD = generatedValues;
    Store.TICKED = tickedValues;
    if (Store.ROOM_ID === "") return;
    firebase
      .firestore()
      .collection(Store.ROOM_ID)
      .doc(Name.WINNER)
      .onSnapshot((data) => {
        if (data.data() === undefined) return;
        var index = -1;
        var number = data.data()[Name.NUMBER];
        if (number === 0) {
          winner(data.data()[Name.WINNER]);
          return;
        }
        for (var m = 0; m < Store.BOARD.length; m++) {
          if (number === Store.BOARD[m]) index = m;
        }
        if (tickedValues[index] || number === 0) return;
        tickedValues[index] = true;
        var sq = document.getElementById(number);
        var p = sq.getElementsByTagName("p")[0];
        sq.style.backgroundColor = "#4393ee";
        p.style.color = "#fff";
        Store.update();
        if (Store.LINES > 0) {
          for (let m = prevLines; m < Store.LINES && m < 5; m++)
            refArray[m].current.style.color = arrColors[m];
          prevLines = Store.LINES;
          if (Store.LINES >= 5) {
            firebase
              .firestore()
              .collection(Store.ROOM_ID)
              .doc(Name.WINNER)
              .set({ number: 0, winner: Store.NAME });
          }
        }
      });
  }, []);

  const winner = (data) => {
    var winner = data;
    if (winner === undefined) return;
    alert("player " + winner + " is the winner");
    firebase.firestore().collection(Store.ROOM_ID).doc(Name.WINNER).delete();
    firebase.firestore().collection(Store.ROOM_ID).doc(Name.CHAT).delete();
    firebase.firestore().collection(Store.ROOM_ID).doc(Name.PLAYERS).delete();
    history.push("/");
    Store.clear();
  };

  const copy = () => {
    navigator.clipboard.writeText(Store.ROOM_ID).then(() => alert("copied"))
  }

  return (
    <div className="main-board">
      {props.roomId !== "" && (
        <div className="roomId">
          <div className="share">
            <i className="fas fa-share-alt"></i>
          </div>
          <h6>Room Id</h6>
          <p>{props.roomId}</p>
          <div className="copy" onClick={copy}>
            <i className="fas fa-copy"></i>
          </div>
        </div>
      )}
      <div className="board">
        {x.map((y) => (
          <div className="row">
            {x.map((x) => (
              <Square value={getValue()} click={() => onTouch(y * 5 + x)} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;
