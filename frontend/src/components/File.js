import { useState } from 'react';
import FileService from "../api/FileService"
import attach from "../assets/attach.png"

const File = ( {setReply, setFileName, imageIcon, reply, replyImage}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    
    const handleFileChange = (event) => {
        let file = event.target.files[0];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.'));
        const newFileName = `${Date.now()}${fileExtension}`; // This will include the original file extension

        const formData = new FormData();
        // Append the file with the custom "name" including the file extension
        formData.append('file', file, newFileName);

        FileService.uploadFile(formData).then(resp => setUploadSuccess(true))

        setSelectedFile(file);

        if (setReply){
            setReply(prevReply => prevReply + "File download: https://any-chats-back-end-chat.yi9ne2.easypanel.host/files/download/" + newFileName)
        }
        if (setFileName){
            setFileName(newFileName)
        }
    }
    
    return (
        <div style={{marginLeft: "5px", cursor: "pointer"}}>
            <div className="file-input-container" style={{cursor: "pointer"}}>
                <input type="file" onChange={handleFileChange} className="file-input" style={{cursor: "pointer"}}/>
                <label htmlFor="file" style={{cursor: "pointer"}}>
                    <img src={imageIcon ? imageIcon : attach} height="20px" width="20px" style={{cursor: "pointer"}}/>
                </label>
            </div>
            {/* {uploadSuccess ? imageIcon ? <i style={{fontSize: "12px"}}>Image attached</i> : <i style={{fontSize: "12px"}}>File attached</i> : null} */}
            {/* * To send, copy link http://localhost:9000/files/download/:filename */}
        </div>
    );
};

export default File