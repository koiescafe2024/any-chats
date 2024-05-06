import { useState, useEffect } from "react"
import LineService from "../api/LineService";
import Popup from "./Popup";
import unread from "../assets/unread.png"
import UserSettings from "./UserSettings";

const ChatMenu = ({ chatBots, selectedChatBot, setSelectedChatBot, chats, setChats, selectedUser, selectedUser2, setSelectedUser, setSelectedUser2 }) => {
    const [settings, setSettings] = useState(false)
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [expandedSpanIndex, setExpandedSpanIndex] = useState(null);

    useEffect( () => {
        // set status of currentSelectedUser.userId === "Read" in chats

        setChats(chats => chats.map(chat => {
            if (chat.userId === selectedUser.userId || chat.userId === selectedUser2.userId) {
                return { ...chat, status: "Read" }; // Update the status of the chat to "Read"
            } else {
                return chat; // Return the chat unchanged if the userId does not match
            }
        }));
    }, [selectedUser, selectedUser2])

    const handleSpanClick = (e, index) => {
        setExpandedSpanIndex(index);
        e.stopPropagation();
        setSettings(!settings);
      };

    const handleButtonClick = () => {
        setPopupOpen(true);
    };

    const handleClosePopup = () => {
        setPopupOpen(false);
    };


    const handleSelectedUser = async (currentSelectedUser) => {
        // if selectedUser exists, setSelectedUser 2

        if (selectedUser.userId === currentSelectedUser.userId && selectedUser.chatbot.id === currentSelectedUser.chatbot.id){
            setSelectedUser({})
        } else if (selectedUser2.userId === currentSelectedUser.userId && selectedUser2.chatbot.id === currentSelectedUser.chatbot.id) {
            setSelectedUser2({})
        }
        else {
            if (Object.keys(selectedUser).length === 0) {
                setSelectedUser(currentSelectedUser);
            } else if (Object.keys(selectedUser2).length === 0){
                setSelectedUser2(currentSelectedUser);
            } else {

            setSelectedUser(currentSelectedUser);
            // setSelectedUser2({});
            }

        }
        // Update status of all messages in chat to "Read"
        await LineService.updateChatMessages(currentSelectedUser.chatbot.id, currentSelectedUser.userId);
        // should add user_id here
    };

    return (
        <div className="chat-menu" style={{minWidth: "225px"}}>
            <div style={{display: "flex", flexWrap: "wrap"}}>
                {chatBots.map((chatbot, i) => (
                    <div
                        key={i}
                        onClick={(chatbot) => {
                            // const selectedValue = e.target.value;
                            // if (selectedValue === 'addChatbot') {
                            //     handleButtonClick();
                            // } else if (selectedValue === ""){
                                    
                            // } else {
                            //     setSelectedUser({});
                            //     setSelectedChatBot(JSON.parse(selectedValue));
                            // }
                        }}
                        style={{borderRadius: "25px", background: chatbot.color, padding: "2px 7.5px", cursor: "pointer", fontSize: "9px", margin: "1px"}}
                    >
                    {chatbot.name}
                    </div>
                ))}
            </div>
            <br/>
            {/* <div style={{minWidth: "100%", maxHeight: "75vh"}}> */}
            <div style={{minWidth: "100%", maxHeight: "75vh", overflowY: "auto"}}>
                <ul style={{listStyle: "none", margin: 0, padding: 0}}>
                    {
                        chats.map( (user, i) => {
                            return(
                                <li
                                key={i}
                                onClick={() => handleSelectedUser(user)}
                                className="chat-menu-item"
                                style={{
                                    background:
                                    user.userId === selectedUser.userId && user.chatbot.id === selectedUser.chatbot.id
                                        ? "lightgoldenrodyellow" // #43840E with 17% opacity
                                        : user.userId === selectedUser2.userId && user.chatbot.id === selectedUser2.chatbot.id
                                            ? "#FEF1E9"
                                            : user.color
                                  }}
                                >
                                    <img src={user.pictureUrl ? user.pictureUrl : user.pictureUrl} height="35 px" width="35px" style={{borderRadius: "50px"}}/>
                                    <div style={{padding: "5px"}}>
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <span style={{fontSize: "14px"}}>{user.displayName}</span>
                                            {/* <img style={{marginLeft: "5px"}} src="https://www.clker.com/cliparts/R/d/z/v/H/1/neon-green-dot-md.png" height="5px" width="5px"/> */}
                                        </div>
                                        <span
                                        style={{
                                            color: "grey",
                                            fontSize: "12px",
                                            overflow: "hidden",
                                            whiteSpace: "nowrap",
                                            textOverflow: "ellipsis",
                                            maxWidth: "150px", // Set a maximum width for the span
                                            display: "block",  // Ensure that text wraps within the span
                                        }}
                                        >
                                        <i>{user.lastMessage}</i>
                                        </span>
                                    </div>
                                    <span
                                    style={{
                                        position: "absolute",
                                        padding: "3px 5px 18px 5px",
                                        lineHeight: "0",
                                        top: "50%",
                                        right: "0%",
                                        fontSize: "9px",
                                        userSelect: "none",
                                    }}
                                    >
                                        <span style={{background: user.chatbot.color, borderRadius: "25px", padding: "0px 4px"}}>{user.chatbot.name}</span>
                                    </span>
                                    <span
                                    style={{
                                        position: "absolute",
                                        padding: "3px 5px 18px 5px",
                                        lineHeight: "0",
                                        top: "0%",
                                        right: "0%",
                                        fontSize: "22px",
                                        userSelect: "none",
                                    }}
                                    onClick={(e) => handleSpanClick(e, i)}
                                    >
                                    ...
                                    </span>
                                    {
                                      user.status === "Unread" 
                                        ? 
                                        <span
                                        style={{
                                            position: "absolute",
                                            lineHeight: "0",
                                            bottom: "0%",
                                            right: "2.5%",
                                            fontSize: "8px",
                                            userSelect: "none",
                                        }}
                                        >
                                            <img src={unread} height="12.5px"/>
                                        </span>
                                        : null
                                    }
                                    {
                                    settings && expandedSpanIndex === i 
                                    ?
                                        <UserSettings
                                            user={user}
                                            chats={chats}
                                            selectedChatBot={selectedChatBot}
                                            setChats={setChats}
                                        />
                                    : null  
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
            {/* <button className="send-button" style={{position: "relative", top: 500, background: "lightcyan", color: "grey"}} onClick={() => handleButtonClick()}>Connect chatbot</button> */}
            {isPopupOpen && <Popup onClose={handleClosePopup} {...popupContent}/>}
        </div>
    );
};

const popupContent = {
    title: "Add chatbot",
    content: "Contact the administrator to add another chatbot...",
    // buttons: [
    //   {
    //     label: "Action 1",
    //     onClick: () => console.log("Action 1 clicked"),
    //   },
    //   {
    //     label: "Action 2",
    //     onClick: () => console.log("Action 2 clicked"),
    //   },
    // ],
  };

export default ChatMenu