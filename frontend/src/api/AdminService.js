import axios from "axios"

// const server_url = "http://localhost:9000/admin";
// const server_url = "https://f9ff-37-152-145-152.ngrok-free.app/admin";//
const server_url = "https://any-chats-back-end-chat.yi9ne2.easypanel.host:9000/admin";
// const server_url = "http://ec2-13-215-184-19.ap-southeast-1.compute.amazonaws.com:9000/admin";

class AdminService{
    getChatBots = async (admin_id) => {//admin_id = profile_id 
        try {
            return await axios
                .post(`${server_url}/bots/chat/get`, {
                    admin_id, admin_id,
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    setUsername = async (user_id, chatbot_id, name) => {
        try {
            return await axios
                .post(`${server_url}/user/name/set`, {
                    user_id, user_id,
                    chatbot_id: chatbot_id,
                    name: name
                }); 
        } catch (err) {
            return console.log(err);
        }
    }

    getOnline = async (user_id, profile_id) => {
        try {
            return await axios
                .post(`${server_url}/online`, {
                    user_id: user_id,
                    profile_id: profile_id
                }); 
        } catch (err) {
            return console.log(err);
        }
    }
}

export default new AdminService()