import { useState, useEffect } from "react"
import File from "./File";
import close from "../assets/close.png"
import FileService from "../api/FileService";

const SharedFiles = ({ onClose, title, content, buttons, profile_id }) => {
    const [files, setFiles] = useState([])

    useEffect( () => {
        FileService.getFiles(profile_id).then(resp => setFiles(resp.data))
    }, [])

    // Remove File
    const handleClick = (file) => {
        FileService.removeFile(file)
        .then(resp => {
            FileService.getFiles(profile_id).then(resp => setFiles(resp.data))
        })
        .catch(err => console.log(err))
    }

    return (
      <div style={{maxHeight: "70vh", overflowY: "auto"}}>
        <div>
             <h2>Uploaded Files</h2>
            <File
            />
        </div>
        <div style={{display: "flex", flexWrap: "wrap"}}>
        {
                files.length !== 0
                ?
                files.map((file, i) => {

                    const fileExtension = file.slice(file.lastIndexOf('.'));

                    if (fileExtension === ".pdf"){
                        return(
                            <div key={i}>
                                <span onClick={() => window.open(`https://181f-2401-4900-1c2b-c482-ac7c-f0cf-7e28-ac0b.ngrok-free.app/files/${file}`, "_blank")} style={{height:"75px", cursor: "pointer"}}>Download<br/>{file}</span>
                                <img src={close} onClick={() => handleClick(file)} height="15px" width="15px" style={{position: "relative", bottom: "0%", right: "0px", cursor: "pointer"}}/>
                            </div>
                        )
                    } else{
                        return(
                            <div key={i}>
                                <img src={`https://181f-2401-4900-1c2b-c482-ac7c-f0cf-7e28-ac0b.ngrok-free.app/files/${file}`} height="75px" style={{margin: "5px"}}/>
                                <img src={close} onClick={() => handleClick(file)} height="15px" width="15px" style={{position: "relative", bottom: "75%", right: "5px", cursor: "pointer"}}/>
                            </div>
                        )
                    }
                })
                : null
            }
        </div>
      </div>
    );
  };


  export default SharedFiles