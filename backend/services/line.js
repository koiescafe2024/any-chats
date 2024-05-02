import axios from "axios"
import https from 'https'
import ApplicationService from "./appservice.js";
import DatabaseService from "./db.js";
import { TIMEOUT } from "dns";
import { response } from "express";

class Line {

    pushMessage = async (messages, to, channelAccessToken) => {
        try {
            const response = await axios.post('https://api.line.me/v2/bot/message/push', {
                to,
                messages
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${channelAccessToken}`,
                }
            });
            return response.data
        } catch (error) {
            console.error(error.data);
        }
    }

    broadcastMessage = async (messages) => {
        try {
            // const channelAccessToken = 'BSSh/9n/cVM/TkpSPznYrhB1OR7OdfISXyJOhE/OA3h9pnEJJVXYkZHdYNb0m6CzZn0WiZSuBu7tbSsEScpRzJhWOxmiL5W2Ad3irwndKnkyEPrjS4hyulBd7V+KTW8h7RHo4+Z5fonY8ecEezDV2QdB04t89/1O/w1cDnyilFU=';
            const channelAccessToken = "L6FTieMdx8X3bPQ5bR/Yv4/KI75U67VZw7dNV67gFDqFT74iry2dz83jJJrZaOZttoqRY5PMpnwQlgpIxsj6tb2nG6qtDz1N7M4eWssVZBbQ/DNvyvDucNC1PIYSaIuRPYcgPtDsm6iBOlHEXpwuOAdB04t89/1O/w1cDnyilFU=";

            const response = await axios.post('https://api.line.me/v2/bot/message/broadcast', {
                messages
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${channelAccessToken}`,
                }
            });
            return response.data
        } catch (error) {
            console.error(error);
        }
    }

    // Request header. See Messaging API reference for specification


    // Options to pass into the request, as defined in the http.request method in the Node.js documentation


    // When an HTTP POST request of message type is sent to the /webhook endpoint,
    // we send an HTTP POST request to https://api.line.me/v2/bot/message/reply
    // that is defined in the webhookOptions variable.

    // Define our request
    getProfile = async (user_id, channelAccessToken) => {
        try {
            console.log("user id.."+user_id);
            const response = await axios.get(`https://api.line.me/v2/bot/profile/${user_id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${channelAccessToken}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }

    

    getContent = async (messageId, channelAccessToken) => {
        try {
            const response = await axios.get(`https://api-data.line.me/v2/bot/message/${messageId}/content`, {
                headers: {
                    'Authorization': `Bearer ${channelAccessToken}`,
                },
                responseType: 'arraybuffer'  // Important: Handle response as binary data
            });

            // Convert binary data to base64
            const base64ImageData = Buffer.from(response.data, 'binary').toString('base64');
            return base64ImageData;
        } catch (error) {
            console.error(error);
        }
    }
}

export default new Line()