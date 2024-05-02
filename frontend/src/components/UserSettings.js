import { useState } from "react"
import LineService from "../api/LineService";
import AdminService from "../api/AdminService";

const UserSettings = ({user, chats, selectedChatBot, setChats}) => {
    const [name, setName] = useState("")

    const handleImportant = (user, color) => {
        const userIndex = chats.findIndex((u) => u.userId === user.userId);
        
        if (userIndex !== -1) {

            const updatedUsers = [...chats];
            updatedUsers[userIndex] = { ...user, color: color };
        
            // Update the database with the updated 'important' value
            LineService.updateChatMessages(selectedChatBot.id, user.userId);
        
            setChats(updatedUsers);
        }
    };

    const setUsername = () => {
        if (name){
            AdminService.setUsername(user.userId, user.chatbot.id, name)
            
            const updatedUsers = chats.map(chat => 
                chat.userId === user.userId ? {...chat, displayName: name} : chat
            );
            
            setChats(updatedUsers);
        }
    }

    return(
        <div
        style={{ position: "absolute", top: "90%", padding: "10px", background: "white", border: "1px solid grey", width: "80%", zIndex: 999 }}
        onClick={(e) => e.stopPropagation()}
        >
            {console.log(chats)}
        Set important:
        <input
            type="checkbox"
            checked={user.color === "pink"}
            onChange={() => handleImportant(user, user.color === "pink" ? "" : "pink")}
        />
        <br />

        Set done:
        <input
            type="checkbox"
            checked={user.color === "lime"}
            onChange={() => handleImportant(user, user.color === "lime" ? "" : "lime")}
        />
        <br />

        Block user:
        <input type="checkbox" />
        <br/>

        Update name:
        <input onChange={e => setName(e.target.value)} type="text" style={{width: "100%"}}/>
        <button onClick={() => setUsername()}>Set name</button>
    </div>
    )
}

export default UserSettings