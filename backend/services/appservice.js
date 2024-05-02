import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs"
import DatabaseService from "./db.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  
class ApplicationService {
    getChatbots = async (admin_id) => {
        try {
            const chatbots = await DatabaseService.readFile("chatbots.json");
    
            let admin_bots = [];
            for (let i=0; i<chatbots.length; i++){
                for (let j=0; j<chatbots[i].admins.length; j++){
                    if (chatbots[i].admins[j] === admin_id){
                        admin_bots.push(chatbots[i])
                    }
                }
            }

            return admin_bots;
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };

    getChannelAccessToken = async (chatbot_id) => {
        try {
            const chatbots = await DatabaseService.readFile("chatbots.json");
    
            for (let i=0; i<chatbots.length; i++){
                if (chatbots[i].id === chatbot_id){
                    return chatbots[i].channelAccessToken
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    };

    getTemplates = async (chatbot_id) => {
        try {
            const chatbots = await DatabaseService.readFile("chatbots.json");

            let templates;
            for (let i=0; i<chatbots.length; i++){
                if (chatbot_id === chatbots[i].id) {
                    templates = chatbots[i].templates
                }
            }
            return templates
        } catch (error) {
            console.error(error);
        }
    }

    setTemplate = async (chatbot_id, template) => {
        try {
            const chatbots = await DatabaseService.readFile("chatbots.json");

            for (let i=0; i<chatbots.length; i++){
                if (chatbot_id === chatbots[i].id) {
                    chatbots[i].templates.push(template)
                }
            }

            return await DatabaseService.updateFile("chatbots.json", chatbots)
        } catch (error) {
            console.error(error);
        }
    }

    removeTemplate = async (chatbot_id, templates) => {
        try {
            const chatbots = await DatabaseService.readFile("chatbots.json");

            const newChatbots = chatbots.map(chatbot => {
                if (chatbot.id === chatbot_id) {
                    chatbot.templates = chatbot.templates.filter(template =>
                        !templates.some(t => t.id === template.id)
                    );
                }
                return chatbot;
            });

            

            return await DatabaseService.updateFile("chatbots.json", newChatbots)
        } catch (error) {
            console.error(error);
        }
    }

    removeUser = async (user_id, chatbot_id) => {
        try {
            // Read the existing messages from the file
            const messages = await DatabaseService.readFile("messages.json");
    
            // Filter out messages that match the user_id and chatbot_id
            const filteredMessages = messages.filter(message => 
                !(message.source.userId === user_id && message.chatbot_id === chatbot_id)
            );
    
            // Update the file with the filtered messages
            return await DatabaseService.updateFile("messages.json", filteredMessages);
        } catch (err) {
            console.log(err);
        }
    }
}

export default new ApplicationService()