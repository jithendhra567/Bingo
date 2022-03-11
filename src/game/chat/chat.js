import React, { createRef, useEffect, useState } from "react";
import "./chat.scss";
import ScrollToBottom from "react-scroll-to-bottom";
import firebase from "../../firebase";
import Store from "../../DataStore.ts";
import Notification from "../../Notification";
import Name from "../../Name";
function Chat(props) {
  
  const [messages, setMessages] = useState([]);
  const [notification,setNotification] = useState(false);
  const sendMessage = createRef();

  const receive = (msg, username) => {
    var messages_Temp = [...Store.MESSAGES];
    for(var x of messages_Temp){
      x['by'] = (x[Name.NAME]===Store.NAME)?"me":"player";
    }
    setMessages(messages_Temp);
  };

  const send = () => {
    var msg = sendMessage.current.value;
    if(msg.length === 0) {
        setNotification(true);
        setTimeout(() => {
            setNotification(false);
        }, 1000);
        return;
    }
    if (msg !== undefined) {
      sendMessage.current.value = "";
      console.log(Store.MESSAGES);
      firebase.firestore().collection(Store.ROOM_ID)
      .doc(Name.CHAT)
      .set({
        message: msg,
        name: Store.NAME
      });
    }
  };

  useEffect(()=>{
    firebase.firestore().collection(Store.ROOM_ID)
    .doc(Name.CHAT)
    .onSnapshot(data => {
        if(data.data()===undefined) return;
        var msg = data.data()[Name.MESSAGE];
        var username = data.data()[Name.NAME];
        if(msg === "") return;
        Store.MESSAGES.push({ message: msg,name: username });
        receive(msg,username);
    });
  },[])

  return (
    <div className="chat">
      <Notification open={notification} msg = "please enter any message to send"/>
      <div className="head">
        <h4>Chat Room</h4>
        <p>10 players</p>
      </div>
      <div className="room">
         <ScrollToBottom className="inbox">
            {messages.map((message) => (
                <div className={message.by}>
                    <p>{message.message}</p>
                    <h5>{message.name}</h5>
                </div>
                ))}
         </ScrollToBottom>

        <div className="bottom">
          <input type="text" placeholder="Enter message" ref={sendMessage} onKeyPress={event => {
              if (event.key === "Enter") {
                send();
              }
            }} />
          <div className="send" onClick={send} >
            <i className="fas fa-location-arrow"></i>
          </div>
        </div>
      </div>
    </div>
  );
}


export default Chat;
