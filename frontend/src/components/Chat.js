import { useState, useEffect, useRef, useContext } from "react"
import { useParams } from "react-router-dom";
import AppContext from "../AppContext.js";
import LineService from '../api/LineService';
import AnswerTemplates from "./AnswerTemplates";
import Image from "./Image";
import File from "./File";
import Emoji from "./Emoji";
import Popup from "./Popup";
import sr from "../assets/sr.png"
import send from "../assets/send.png"
import auroraPing from "../assets/msn.mp3"
import close from "../assets/close.png"

const Chat = ( {selectedChatBot, selectedUser, setSelectedUser, socket, color, setChats} ) => {
    let params = useParams()
    const { user, userMerchant } = useContext(AppContext);
    const [messages, setMessages] = useState([])
    const [reply, setReply] = useState("")
    const [replyImage, setReplyImage] = useState({})
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [isPopupOpen2, setPopupOpen2] = useState(false);
    const [answer, setAnswer] = useState("")
    const [templateFile, setTemplateFile] = useState("")
    const [imagesData, setImagesData] = useState({})
    const [fullscreenImage, setFullscreenImage] = useState({})
    const chatContainerRef = useRef(null);
  
    useEffect(() => {
      if (selectedChatBot){
        LineService.getChatMessages(selectedChatBot.id, selectedUser.userId)
        .then(resp => {
          setMessages(resp.data)
        })

        const chatContainer = chatContainerRef.current;
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth',
        });
      }
  
      // Event listener for when the connection is established
      socket.addEventListener('open', (event) => {
        console.log('WebSocket connection is open.');
      });
  
      // Event listener for receiving messages from the server
      socket.addEventListener('message', (event) => {
        const wsMessage = JSON.parse(event.data)
        // console.log("WebSocket message:", wsMessage)
        
        if (parseInt(wsMessage.chatbot_id) === selectedUser.chatbot.id){
          LineService.getChatMessages(selectedUser.chatbot.id, selectedUser.userId)
            .then(resp => setMessages(resp.data))
        } else {
          console.log("Got a message on another chatbot")
        }

          LineService.getChats(parseInt(params.profile_id))
          .then(resp => {
            if (resp){
              if (wsMessage.sender === "User"){
                const audio = new Audio(auroraPing);
                audio.play()
                .catch(error => console.log(error)); // Handle any errors that occur during playback
              }
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
            }
          })
      });
  
      // Event listener for handling errors
      socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
      });
  
      // Event listener for when the connection is closed
      socket.addEventListener('close', (event) => {
        if (event.wasClean) {
          console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=`, event);
        } else {
          console.error('WebSocket connection abruptly closed.');
        }
      });
  
    }, [])

    // Scrolls to the bottom of the chat windows when messages are loaded
    useEffect(() => {
      const chatContainer = chatContainerRef.current;
      chatContainer.scrollTo({
        top: chatContainer.scrollHeight,
        behavior: 'smooth',
      });
    }, [messages])

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleString('en-US', options);
      }
  
    const handleClick = () => {
      let messages = [];
      if (reply !== "" && Object.keys(replyImage).length !== 0){
        // send two messages in a row
        const message1 = {
          type: "text",
          text: reply,
        }
        messages.push(message1)
        messages.push(replyImage)
      }
      else if (reply !== ""){
        const message = {
          type: "text",
          text: reply,
        }
        messages.push(message)
      }
      else if (Object.keys(replyImage).length !== 0){
        messages.push(replyImage)
      }
      const socketMessage = {
        chatbot_id: selectedChatBot.id,
        user_id: selectedUser.userId,
        admin: user,
        messages: messages
      }
      console.log("user id="+selectedUser.userId);
      socket.send(JSON.stringify(socketMessage))
      setReply("")
      setReplyImage({})
    }

    const handleButtonClick = () => {
        setPopupOpen(!isPopupOpen);
    };
  
    const handleClosePopup = () => {
        setPopupOpen(false);
        setPopupOpen2(false);
    };
  
    const handleClick2 = () => {
      const template = {
        id: Date.now(),
        answer: answer,
        fileName: templateFile,
      }
      LineService.setTemplate(selectedChatBot.id, template)
      setAnswer("")
      setPopupOpen2(false);
    }

    const popupContent2 = {
      title: "Create new standard reply",
      content: (
        <div>
          Answer <input onChange={(e) => setAnswer(e.target.value)} />
          <br/>

          <File
            setFileName={setTemplateFile}
          />
          <br/>
          <br/>
          <button onClick={() => handleClick2()}>Create new</button>
        </div>
      ),
    };

    const handleDownloadClick = async (message) => {
      const base64Data = await LineService.getContent(message);
      // Update the state with the new image data
      if (base64Data){
        setImagesData(prevImagesData => ({
          ...prevImagesData,
          [message.message.id]: base64Data.data.imageData
        }));
      }
    };

    const overlayStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'lightgoldenrodyellow',
        zIndex: 1000, // Ensure it's above everything else
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };
    
    const fullscreenImageStyles = {
        maxWidth: '90%',
        maxHeight: '90%',
    };

    return(
        <div style={{display: "flex"}}>
          <div className="chat" style={{boxShadow: "inset 0 4px 8px lightgoldenrodyellow", background:"lightgoldenrodyellow", borderRadius: "20px", margin: "0px 15px"}}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "90%", padding: "15px 15px 5px 15px"}}>
                  <div style={{display: "flex", alignItems: "center"}}>
                    <img src={selectedUser.pictureUrl ? selectedUser.pictureUrl : null} height="35px" width="35px" style={{borderRadius: "50px"}}/>
                    <p style={{marginLeft:"5px"}}> {selectedUser.displayName}</p>
                  </div>
                  <p style={{background: selectedChatBot ? selectedChatBot.color : null, borderRadius: "20px", padding: "0px 2px",fontSize:"12px"}}>{selectedChatBot ? selectedChatBot.name : null}</p>
                  <img onClick={() => setSelectedUser({})} src={close} height="20px" width="20px" style={{cursor: "pointer"}}/>
              </div>
              <div style={{background: color, height: "1px"}}>
              </div>
              <div style={{display: "flex"}}>
                  <div style={{width: "100%"}}>
                          <div>
                              <div ref={chatContainerRef} style={{width: "100%", height: "500px", overflowY: "auto"}}>
                                  <ul style={{ listStyle: "none", margin: 10, padding: 0 }}>
                                      {messages.map((message, i) => {
                                          const isUser = message.source.type === "user";
                                          const itemClass = `chat-interface-item ${isUser ? "chat-interface-item-user" : "chat-interface-item-admin"}`;
                                          const itemClassBubble = `${isUser ? "chat-interface-item-bubble-user" : "chat-interface-item-bubble-admin"}`;

                                          if (message.message.type === "image" && message.source.type === "user"){
                                            handleDownloadClick(message)
                                          }
                                          
                                          return (
                                          <li key={i} className={itemClass}>
                                              <div className={itemClassBubble}
                                              style={{
                                                overflow: "hidden",
                                                maxWidth: "250px", // Set a maximum width for the div
                                                display: "block",  // Ensure that text wraps within the div
                                                wordWrap: "break-word", // Allow words to break to a new line
                                              }}
                                              >
                                                  {
                                                      message.message.type === "sticker"
                                                      ? 
                                                      <div>
                                                        <img src={`https://stickershop.line-scdn.net/stickershop/v1/sticker/${message.message.stickerId}/android/sticker.png`} alt="Image" height="75px" />
                                                      </div>
                                                      : 
                                                      message.message.type === "image" && message.source.type === "user"
                                                      ? 
                                                      <div>
                                                        {imagesData[message.message.id] ? <img src={`data:image/jpeg;base64,${imagesData[message.message.id]}`} alt="Image" height="150px" onClick={() => setFullscreenImage({src: `data:image/jpeg;base64,${imagesData[message.message.id]}`})} style={{cursor: "pointer"}}/> : "Loading image..."}
                                                      </div>
                                                      : 
                                                      message.message.type === "image" && message.source.type !== "user"
                                                      ?
                                                        <img src={message.message.originalContentUrl} height="75px"/> 
                                                      :
                                                      message.message.text
                                                  }
                                              </div>
                                              <div className="chat-timestamp">
                                              {
                                              message.source.type === "user"
                                                  ? `${selectedUser.displayName}: ${formatTimestamp(message.timestamp)}`
                                                  : `${message.source.type}: ${formatTimestamp(message.timestamp)}`
                                              }
                                              </div>
                                          </li>
                                          );
                                      })}
                                  </ul>
                              </div>
                              <div style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px"}}>
                                  <div className="chat-input-container">
                                      <input
                                          type="text"
                                          value={reply}
                                          className="chat-input"
                                          style={{borderTopLeftRadius: "25px", borderTopRightRadius: "25px", border: "2px solid whitesmoke"}}
                                          onChange={(e) => setReply(e.target.value)}
                                          placeholder="Type your message..."
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              handleClick(); // Call the handleClick function when Enter is pressed
                                            }
                                          }}
                                      />
                                  </div>
                                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottomLeftRadius: "25px", borderBottomRightRadius: "25px", border: "2px solid whitesmoke", borderTop: "none", background: "white", margin: "0px 10px"}}>
                                    <div style={{display: "flex"}}>
                                      <Emoji
                                        setReply={setReply}
                                      />
                                      <File
                                        setReply={setReply}
                                        style={{cursor: "pointer"}}
                                        reply={reply}
                                      />
                                      <Image
                                        replyImage={replyImage}
                                        setReplyImage={setReplyImage}
                                        style={{cursor: "pointer"}}
                                      />
                                    </div>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                      <img
                                        src={sr}
                                        style={{height: "20px", cursor: "pointer", marginRight: "5px"}}
                                        onClick={handleButtonClick}
                                      />
                                      <img src={send} style={{cursor: "pointer"}} height="25px" onClick={() => handleClick()}/>
                                    </div>
                                  </div>
                                  {isPopupOpen2 && <Popup onClose={handleClosePopup} {...popupContent2} />}
                                  {/* Overlay for fullscreen image*/}
                                  {Object.keys(fullscreenImage).length !== 0
                                    ?
                                    <div id="imageOverlay" onClick={() => setFullscreenImage({})} style={{...overlayStyles}}>
                                      <img id="fullscreenImage" src={fullscreenImage.src} alt="Full Screen" style={fullscreenImageStyles} />
                                  </div>
                                    : null
                                  }
                              </div>
                          </div>
                  </div>
              </div>
        </div>
        {
          isPopupOpen
          ?
          <div style={{width: "250px", maxHeight: "75vh", overflowY: "auto", border: "2px solid whitesmoke", margin: "5px"}}>
            <AnswerTemplates
              selectedChatBot={selectedChatBot}
              setReply={setReply}
              setReplyImage={setReplyImage}
            />
            <button onClick={() => setPopupOpen2(true)}>Create new</button>
          </div>
          : null
        }
      </div>

    )

}

export default Chat