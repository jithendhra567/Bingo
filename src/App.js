import "./App.css";
import Board from "./board/board";
import { useEffect, useState } from "react";
import Instructions from "./instructions/instructions";
import CustomButton from "./dialog";
import { Switch, Route } from "react-router-dom";
import Game from "./game/game";
import { createRef } from "react";
import Notification from "./Notification";
const Main = () => {
  //Notification
  const [notification, setNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const Notify = (message) => {
    setNotification(true);
    setNotificationMessage(message);
    setTimeout(() => {
      setNotification(false);
    }, 1000);
  };

  const inputRef = createRef();
  const getName = () => {
    if (inputRef.current == null) return "";
    var x = inputRef.current.value;
    return x;
  };

  return (
    <div>
      <Notification open={notification} msg={notificationMessage} />
      <div className="flex">
        <Instructions />
        <div className="main">
          <div className="input">
            <i className="fas fa-users"></i>
            <input type="text" placeholder="Enter your name" ref={inputRef} />
          </div>
          <div className="buttons">
            <CustomButton
              name="create room"
              color="primary"
              callback={(msg) => Notify(msg)}
              username={() => getName()}
            />
            <CustomButton
              name="join room"
              color="secondary"
              callback={(msg) => Notify(msg)}
              username={() => getName()}
            />
          </div>
        </div>
        <Board roomId="" />
      </div>
    </div>
  );
};

function App() {
  useEffect(() => {}, []);

  const Title = () => {
    return (
      <p>
        <span className="red">B</span>
        <span className="green">I</span>
        <span className="purple">N</span>
        <span className="blue">G</span>
        <span className="pink">O</span>
      </p>
    );
  };

  const refArray = [];
  for (var i = 0; i < 5; i++) refArray.push(createRef());

  return (
    <div className="App">
      <div className="heading">
        <Switch>
          <Route exact path="/">
            <Title />
          </Route>
          <Route path="/game">
            <p className="title">
              <span ref={refArray[0]}>B</span>
              <span ref={refArray[1]}>I</span>
              <span ref={refArray[2]}>N</span>
              <span ref={refArray[3]}>G</span>
              <span ref={refArray[4]}>O</span>
            </p>
          </Route>
        </Switch>
      </div>
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route path="/game">
          <Game array={refArray} />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
