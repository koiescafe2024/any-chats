import { useEffect, useState } from 'react';
import File from './File';
import image from "../assets/image.png"

const Image = ( {replyImage, setReplyImage} ) => {
    const [fileName, setFileName] = useState("");

    useEffect( () => {

        if (fileName !== ""){
            const fileExtension = fileName.slice(fileName.lastIndexOf('.'));

            if (fileExtension === ".pdf"){
                console.log("Can't send", fileExtension, "as image. Send as file instead.")
            } else {
                const reply = {
                    type: "image",
                    originalContentUrl: `https://any-chats-back-end-chat.yi9ne2.easypanel.host/files/${fileName}`,
                    previewImageUrl: `https://any-chats-back-end-chat.yi9ne2.easypanel.host/${fileName}`
                }
        
                setReplyImage(reply)
            }
        }
    }, [fileName])
    
    return (
        <div style={{display: "flex"}}>
            <File
                setFileName={setFileName}
                imageIcon={image}
            />
            {replyImage ? Object.keys(replyImage).length !== 0 ? <i style={{fontSize: "12px"}}>Image attached</i> : null : null}
        </div>

    );
};

export default Image