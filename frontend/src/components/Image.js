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
                    originalContentUrl: `https://181f-2401-4900-1c2b-c482-ac7c-f0cf-7e28-ac0b.ngrok-free.app/files/${fileName}`,
                    previewImageUrl: `https://181f-2401-4900-1c2b-c482-ac7c-f0cf-7e28-ac0b.ngrok-free.app/${fileName}`
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