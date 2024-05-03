import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import '../App.css';
import LineService from '../api/LineService';
import Chat from "../components/Chat";
import ChatMenu from "../components/ChatMenu";
import Header from "../components/Header";
import AdminService from "../api/AdminService";
import File from "../components/File";
import AnswerTemplates from "../components/AnswerTemplates";
import Popup from "../components/Popup"
import SharedFiles from "../components/SharedFiles";
import auroraPing from "../assets/aurora-ping.mp3"


function Home() {
  let params = useParams()
  const [chatBots, setChatBots] = useState([])
  const [chats, setChats] = useState([])
  const [selectedChatBot, setSelectedChatBot] = useState({})
  const [selectedUser, setSelectedUser] = useState({})
  const [selectedUser2, setSelectedUser2] = useState({})
  const [reRender, setReRender] = useState(false)
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [online, setOnline] = useState([])
 

  // const socket = new WebSocket(`wss://f9ff-37-152-145-152.ngrok-free.app/frontend`);
  const socket = new WebSocket(`wss://olll-cha-ts-backend.6o1yzt.easypanel.host/frontend/${params.user_id}/${params.profile_id}`);


  useEffect( () => {
    AdminService.getOnline(params.user_id, params.profile_id).then(resp => setOnline(resp.data))

    AdminService.getChatBots(params.profile_id)
    .then(resp => {
      setChatBots(resp.data);
      setSelectedChatBot(resp.data[0])
    
    })
    setReRender(false)
  }, [reRender])

  useEffect( () => {
      LineService.getChats(parseInt(params.profile_id))
      .then(resp => {
       

        setChats(resp.data.sort((a, b) => {
          // If a is unread and b is not, a comes first
          if (a.status === "Unread" && b.status !== "Unread") {
              return -1;
          }
          // If b is unread and a is not, b comes first
          else if (b.status === "Unread" && a.status !== "Unread") {
              return 1;
          }
          // If both are unread or both are not unread, maintain original order
          return 0;
        }));

        // if (resp.data.length !== 0){
        //   setSelectedUser(resp.data[0])
        //   if (resp.data.length !== 1){
        //     setSelectedUser2(resp.data[1])
        //   }
        // }
      })
  }, [chatBots])

  useEffect( () => {

    // // Event listener for when the connection is established
    // socket.addEventListener('open', (event) => {
    //   console.log('WebSocket connection is open.');
    // });

    // // Event listener for receiving messages from the server
    // socket.addEventListener('message', (event) => {
    //   console.log("WebSocket message:", event.data)

    //   // const audio = new Audio(auroraPing);
    //   // audio.play()
    //   //     .catch(error => console.log(error)); // Handle any errors that occur during playback

    //   // if (selectedChatBot){
    //   //   if (parseInt(event.data) === selectedChatBot.id){
    //   //     // LineService.getChatMessages(selectedChatBot.id, selectedUser.userId).then(resp => setMessages(resp.data))
    //   //   } else {
    //   //     console.log("Got a message on another chatbot, should update ChatMenu")
    //   //     setUpdateChatMenu(true)
    //   //   }
    //   // }
    // });

    // // Event listener for handling errors
    // socket.addEventListener('error', (error) => {
    //   console.error('WebSocket error:', error);
    // });

    // // Event listener for when the connection is closed
    // socket.addEventListener('close', (event) => {
    //   if (event.wasClean) {
    //     console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=`, event);
    //   } else {
    //     console.error('WebSocket connection abruptly closed.');
    //   }
    // });
  }, [])

  return (
    <div className="App">
      {/* <div className="menu">
        KooChat<br/>
        <ul>
        - Add image in Q/A<br/>
        - Block user<br/>
        - Color for user that hasn't responded/seen<br/>
        - Full deployment<br/>
        </ul>
      </div> */}

      <div>
        <Header
          selectedChatBot={selectedChatBot}
          setReRender={setReRender}
        />

        <div style={{flex: 1, display: "flex", padding: "25px"}}>
          <ChatMenu
            chatBots={chatBots}
            selectedChatBot={selectedChatBot}
            setSelectedChatBot={setSelectedChatBot}
            chats={chats}
            setChats={setChats}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
            selectedUser2={selectedUser2}
            setSelectedUser2={setSelectedUser2}
          />
        <div style={{ flex: 0.5, display: "flex", flexDirection: "column" }}>
            <div style={{margin: "0px 15px 15px 15px", color: "#43840E"}}>
              <span style={{}}>Online: </span>
                {
                  online.map( (online, i) => {
                    return(
                      <span key={i} style={{fontSize: "10px", marginLeft: "5px"}}>{online.admin}</span>
                    )
                  })
                }
            </div> 

            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {Object.keys(selectedUser).length !== 0 && (
                <Chat
                  key={selectedUser.userId}
                  selectedChatBot={selectedUser.chatbot}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  socket={socket}
                  color="rgba(67, 132, 14, 0.17)"
                  setChats={setChats}
                />
              )}
              {Object.keys(selectedUser2).length !== 0 && selectedUser.userId !== selectedUser2.userId && (
                <Chat
                  key={selectedUser2.userId}
                  selectedChatBot={selectedUser2.chatbot}
                  selectedUser={selectedUser2}
                  setSelectedUser={setSelectedUser2}
                  socket={socket}
                  color="#FEF1E9"
                  setChats={setChats}
                />
              )}
            </div>
        </div>
        <div style={{ flex: 0.5, margin: "0px 15px"}}>
          <SharedFiles
            profile_id={params.profile_id}
          />
        </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
