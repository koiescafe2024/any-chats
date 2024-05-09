import axios from "axios"

 const server_url = "https://any-chats-back-end-chat.yi9ne2.easypanel.host/line";
// const server_url = "https://f9ff-37-152-145-152.ngrok-free.app/line";
//const server_url = "https://definitelynotabank.com:9000/line";
// const server_url = "http://ec2-13-215-184-19.ap-southeast-1.compute.amazonaws.com:9000/line";

class LineService{
    getChatMessages = async (chatbot_id, user_id) => {
        try {
            return await axios
                .post(`${server_url}/chat/messages/get`, {
                    chatbot_id, chatbot_id,
                    user_id: user_id,
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    getChats = async (admin_id) => {
        try {
            return await axios
                .post(`${server_url}/chats/get`, {
                    admin_id, admin_id,
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    updateChatMessages = async (chatbot_id, user_id) => {
        try {
            return await axios
                .post(`${server_url}/chats/update`, {
                    chatbot_id, chatbot_id,
                    user_id: user_id,
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    reply = async (jobs) => {
        try {
            return await axios
                .post(`${server_url}/message/reply`, {
                    jobs: jobs
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    broadcastMessage = async (message) => {
        try {
            return await axios
                .post(`${server_url}/bot/message/broadcast`, {
                    message: message
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    getTemplates = async (chatbot_id) => {
        try {
            return await axios
                .post(`${server_url}/bot/templates/get`, {
                    chatbot_id: chatbot_id
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    setTemplate = async (chatbot_id, template) => {
        try {
            return await axios
                .post(`${server_url}/bot/templates/set`, {
                    chatbot_id: chatbot_id,
                    template: template
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    removeTemplate = async (chatbot_id, templates) => {
        try {
            return await axios
                .post(`${server_url}/bot/templates/remove`, {
                    chatbot_id: chatbot_id,
                    templates: templates
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    uploadFile = async (hi) => {
        try {
            return await axios
                .post(`${server_url}/files/upload`, {
                    hi: hi,
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    getContent = async (message) => {
        try {
            return await axios
                .post(`${server_url}/content`, {
                    message: message
                }); 
        } catch (err) {
            return console.log(err);
        }
    }
}

export default new LineService()