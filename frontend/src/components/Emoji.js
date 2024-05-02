import { useState } from "react"
import EmojiPicker from 'emoji-picker-react'
import smiley from "../assets/smiley.png"


const Emoji = ( {setReply} ) => {
    const [chooseEmoji, setChooseEmoji] = useState(false)
    const [emojiSuccess, setEmojiSuccess] = useState(true);

    return(
        <div>
        <img style={{cursor: "pointer"}} src={smiley} onClick={() => setChooseEmoji(!chooseEmoji)} height="20px"/>
        {
            chooseEmoji
            ? 
            <EmojiPicker
                onEmojiClick={(emojiData) => setReply(prevReply => prevReply + emojiData.emoji)}
            /> 
            : null
        }

        {/* {emojiSuccess ? <i>0 emojis attached</i> : null} */}

        </div>
    )
}

export default Emoji