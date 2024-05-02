import { useState } from "react"
import LineService from "../api/LineService"
import logo from "../assets/KooChat_logo.png"
import Image from "./Image"
import broadcast from "../assets/broadcast.png"

const Header = ( {setReRender, selectedChatBot} ) => {
    const [broadcastMessage, setBroadcastMessage] = useState("")
    const [replyImage, setReplyImage] = useState({})

    const handleChange = (text) => {
        setBroadcastMessage(text)
    }

    const handleClick = () => {
        console.log(broadcastMessage)
        let messages = [];
        if (broadcastMessage !== "" && Object.keys(replyImage).length !== 0){
          // send two messages in a row
          const message1 = {
            type: "text",
            text: broadcastMessage,
          }
          messages.push(message1)
          messages.push(replyImage)
        }
        else if (broadcastMessage !== ""){
          const message = {
            type: "text",
            text: broadcastMessage,
          }
          messages.push(message)
        }
        else if (Object.keys(replyImage).length !== 0){
          messages.push(replyImage)
        }
        const socketMessage = {
          chatbot_id: selectedChatBot.id,
        //   user_id: selectedUser.userId, // ALL
          messages: messages
        }
        LineService.broadcastMessage(socketMessage).then(resp => console.log(resp.data))
        setReRender(true)
      }

    return(
        <div className="header">
            <div style={{ alignSelf: "flex-start", width: "60%", marginLeft: "25px"}}>
                <img src={logo} alt="KooChat Logo" height="50px"/>
            </div>
            <div className="container" style={{ alignSelf: "center" }}>
                <input className="input-field" onChange={e => handleChange(e.target.value)} style={{ width: "60%"}} placeholder="Type your message" />
                <Image
                    setReplyImage={setReplyImage}
                />
                <button className="broadcast-button" style={{display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "25px"}} onClick={() => handleClick()}><img src={broadcast} height="20px"/> Broadcast message</button>
            </div>
        </div>
    )
}

export default Header