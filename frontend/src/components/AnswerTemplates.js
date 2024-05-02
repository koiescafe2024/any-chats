import { useState, useEffect } from "react"
import LineService from "../api/LineService"
import trash from "../assets/trash.png"

const AnswerTemplates = ( { selectedChatBot, setReply, setReplyImage }) => {
    const [templates, setTemplates] = useState([])
    const [trigger, setTrigger] = useState(0)

    useEffect( () => {
        if (selectedChatBot){
            LineService.getTemplates(selectedChatBot.id).then(resp => setTemplates(resp.data))
        }
    }, [selectedChatBot, trigger])

    const handleRemove = (template) => {
        LineService.removeTemplate(selectedChatBot.id, [template])
    };

    const handleReply = (template) => {
        if (template.answer !== ""){
            setReply(template.answer)
        }
        if (template.fileName !== "" && template.fileName !== undefined) {
            const replyImage = {
                type: "image",
                originalContentUrl: `https://181f-2401-4900-1c2b-c482-ac7c-f0cf-7e28-ac0b.ngrok-free.app/files/${template.fileName}`,
                previewImageUrl: `https://181f-2401-4900-1c2b-c482-ac7c-f0cf-7e28-ac0b.ngrok-free.app/files/${template.fileName}`
            }
            setReplyImage(replyImage)
        } else {
            setReplyImage({})
        }
    }

    return(
        <div style={{}}>
            <ul style={{listStyle: "none", margin: 0, padding: 0}}>
            {
                templates.map( (template, i) => {
                    return(
                        <li key={i} onClick={() => handleReply(template)} style={{fontSize: "12px", padding: "3px", cursor: "pointer"}}>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px"}}>
                                <div>
                                {template.fileName !== "" && template.fileName !== undefined ? <img src={`https://definitelynotabank.com:9000/files/${template.fileName}`} height="40px"/> : null}
                                {template.answer}
                                </div>
                                <img onClick={(e) => {setTrigger(trigger+1); e.stopPropagation(); handleRemove(template);}} style={{cursor: "pointer"}} src={trash} height="25px"/>
                            </div>
                        </li>
                    )
                })
            }
            </ul>
        </div>
    )
}

export default AnswerTemplates