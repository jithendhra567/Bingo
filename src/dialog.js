import React, { createRef, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import firebase from "./firebase";
import { useHistory } from "react-router-dom";
import Name from "./Name";
import Store from "./DataStore";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CustomButton(props) {
  const [open, setOpen] = useState(false);
  const userName = props.username();
  const history = useHistory();
  var roomId = "";
  const handleClickOpen = () => {
    setOpen(true);
  };

  //creating Room Id
  var current = new Date();
  var str = current.toLocaleString();
  for (var i of str) {
    if (!isNaN(i)) roomId = roomId + i;
  }

  const handleClose = () => {
    setOpen(false);
    Store.NAME = userName;
    //creating Room
    roomId = userName.substr(0, 3) + roomId.split(" ")[1];
    Store.ROOM_ID = roomId;
    const data = [
      {
        name: userName,
        currentPlayer: true,
        lines: 0,
        currentNumber: 0,
      },
    ];

    //joining the room
    if (props.name === "join room") {
      roomId = document.getElementById("outlined")["value"];
      Store.ROOM_ID = roomId;
      var players = [];
      firebase
        .firestore()
        .collection(roomId)
        .doc(Name.PLAYERS)
        .get()
        .then((data) => {
          if (data.data()[Name.START]) {
            props.callback("Room is closed");
            return;
          }
          players = data.data()[Name.USERS];
          players.push({
            name: userName,
            currentPlayer: false,
            lines: 0,
            currentNumber: 0,
          });
          pushData(players);
        })
        .catch((err) => {
          console.log(err);
          props.callback("room id not found, please try again");
        });
    }
    //create a new room
    else {
      Store.CREATOR = true;
      firebase
        .firestore()
        .collection(roomId)
        .doc(Name.WINNER)
        .set({ number: 0 });
      firebase
        .firestore()
        .collection(roomId)
        .doc(Name.CHAT)
        .set({ message: "", name: "" });
      pushData(data);
    }
  };

  const pushData = (data) => {
    firebase
      .firestore()
      .collection(roomId)
      .doc(Name.PLAYERS)
      .set({ users: data, start: false })
      .then(() => {
        props.callback("successfully created Room");
        alert("please don't reload or else you will lost your game");
        history.push("/game");
      })
      .catch(() => {
        props.callback("please check the network and try again");
      });
  };

  const close = () => {
    setOpen(false);
    history.push("/");
  };

  const InputField = (props) => {
    return (
      <div>
        <form noValidate autoComplete="off">
          <TextField id="outlined" label="Room Id" variant="outlined" />
        </form>
      </div>
    );
  };

  return (
    <div>
      <Button variant="contained" color={props.color} onClick={handleClickOpen}>
        {props.name}
      </Button>

      {userName.length > 0 && !props.winner ? (
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
        >
          <DialogTitle>BINGO {props.name}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.name === "create room" ? (
                "Do you want to create a new room"
              ) : (
                <InputField />
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={close} color="primary">
              cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              {props.name}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
        >
          <DialogTitle>Bingo {props.name}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {props.winner ? props.winnerName : "please enter the user name"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={close} color="primary">
              close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
}
