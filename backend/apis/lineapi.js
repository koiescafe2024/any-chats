import express from 'express';
import axios from "axios"
import DatabaseService from '../services/db.js';
import ApplicationService from '../services/appservice.js';
import Line from '../services/line.js';
import https from 'https';
import LINEBot from 'line-messaging';
const router = express.Router();




router.get('/', async (req, res) => {
});

router.post('/chats/get', async (req, res) => {
    const { admin_id } = req.body
    try {
        const chatbots = await ApplicationService.getChatbots(admin_id)
        const messages = await DatabaseService.readFile("messages.json");

        const allProfilePromises = []; // Collect all promises across all chatbots
        
        // get user_ids and profiles
        for (let x = 0; x < chatbots.length; x++) {
            const existingIds = new Set();
            const profilePromises = [];
        
            // for (let i = messages.length - 1; i >= 0 && existingIds.size < 20; i--) {
            for (let i = 0; i < messages.length ; i++) {
                if (chatbots[x].id === messages[i].chatbot_id) {
                    const userId = messages[i].source.userId;
        
                    if (!existingIds.has(userId)) {
                        existingIds.add(userId);
        
                        // Collect promise without awaiting here
                        profilePromises.push(
                            Line.getProfile(userId, chatbots[x].channelAccessToken)
                                .then(async profile => {
                                    if (profile) {
                                        profile.chatbot = chatbots[x];
                                        return profile; // This profile will be included in the results
                                    } else {
                                        // console.log("Couldn't get profile for user:", userId);
                                        await ApplicationService.removeUser(userId, chatbots[x].id) // because the server doesnt catch all "unfollows"
                                        return null; // Filter these out later
                                    }
                                })
                                .catch(error => {
                                    // console.error("Error fetching profile for user:", userId, error);
                                    return null; // Filter these out later
                                })
                        );
                    }
                }
            }
        
            // Instead of waiting here, just collect the promise
            allProfilePromises.push(Promise.all(profilePromises).then(fetchedProfiles => fetchedProfiles.filter(profile => profile !== null))); // Filter nulls from failed requests
        }
        
        // Wait for all promises across all chatbots to complete
        const results = await Promise.all(allProfilePromises);
        // Now, results is an array of arrays of profiles, each corresponding to a chatbot
        const profiles = results.flat(); // Flatten the array if you just want a single list of profiles

        const users = await DatabaseService.readFile("users.json");
        for (let i=0; i<profiles.length; i++){

            for (let j=0; j<users.length; j++){
                if (users[j].user_id === profiles[i].userId && users[j].chatbot_id === profiles[i].chatbot.id){
                    profiles[i].displayName = users[j].editedDisplayName
                }
            }

            for (let j=messages.length-1; j>=0; j--) {
                if (profiles[i].lastMessage === undefined && messages[j].source.userId === profiles[i].userId && messages[j].chatbot_id === profiles[i].chatbot.id){
                    if (messages[j].source.type === "admin"){
                        if (messages[j].message.type === "sticker"){
                            profiles[i].lastMessage = "Admin: Sent a sticker"
                        } 
                        else if (messages[j].message.type === "image"){
                            profiles[i].lastMessage = "Admin: Sent an image"
                        }
                        else if (messages[j].message.type === "text"){
                            profiles[i].lastMessage = `Admin: ${messages[j].message.text}`
                        }
                    } else {
                        if (messages[j].message.type === "sticker"){
                            profiles[i].lastMessage = "Sent a sticker"
                        } 
                        else if (messages[j].message.type === "image"){
                            profiles[i].lastMessage = "Sent an image"
                        }
                        else if (messages[j].message.type === "text"){
                            profiles[i].lastMessage = messages[j].message.text
                        }
                    }
                }
                if (messages[j].status && messages[j].status === "Unread" && messages[j].source.userId === profiles[i].userId  && messages[j].chatbot_id === profiles[i].chatbot.id) {
                    profiles[i].status = "Unread"
                    // break;
                }
            }
        } 

        res.status(200).send(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/chats/update', async (req, res) => {
    const { chatbot_id, user_id } = req.body
    try {
        const messages = await DatabaseService.readFile("messages.json");

        // chatbot_id && user_id
        for (let i = 0; i < messages.length; i++) {
            if (chatbot_id === messages[i].chatbot_id && user_id === messages[i].source.userId){
                messages[i].status = "Read"
            }
        }

        await DatabaseService.updateFile("messages.json", messages)
        
        res.status(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/bot/message/broadcast', async (req, res) => {
    const { message } = req.body

    try {
        const messages = await DatabaseService.readFile("messages.json");
        const uniqueChats = [];
        const existingIds = new Set();
        for (let i = 0; i < messages.length; i++) {
            if (message.chatbot_id === messages[i].chatbot_id){
                const userId = messages[i].source.userId;
                // Check if userId is not already in the Set
                if (!existingIds.has(userId)) {
                    existingIds.add(userId);
                    uniqueChats.push({ id: userId });
                }
            }
        }

        await Line.broadcastMessage(message.messages)

        const newMessages = []
        for (let i=0; i<uniqueChats.length; i++){
            for (let j=0; j<message.messages.length; j++){
                const newMessage = {
                    type: "message",
                    chatbot_id: message.chatbot_id,
                    message: message.messages[j],
                    source: {
                        type: "admin",
                        userId: uniqueChats[i].id,
                    },
                    timestamp: Date.now(),
                    // status: "created"
                }
                newMessages.push(newMessage)
            }
        }


        for (let i=0; i<newMessages.length; i++){
            await DatabaseService.addObject("messages", newMessages[i])
        }

        res.status(200)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/bot/templates/get', async (req, res) => {
    const { chatbot_id } = req.body
    try {
        const templates = await ApplicationService.getTemplates(chatbot_id)
        res.status(200).send(templates)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/bot/templates/set', async (req, res) => {
    const { chatbot_id, template } = req.body
    try {
        await ApplicationService.setTemplate(chatbot_id, template)
        res.status(200)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/bot/templates/remove', async (req, res) => {
    const { chatbot_id, templates } = req.body
    try {
        await ApplicationService.removeTemplate(chatbot_id, templates)
        res.status(200)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/chat/messages/get', async (req, res) => {
    const { chatbot_id, user_id } = req.body
    try {
        const messages = await DatabaseService.readFile("messages.json")
        let userMessages = []
        for (let i=0; i<messages.length; i++){
            if (chatbot_id === messages[i].chatbot_id && user_id === messages[i].source.userId){
                userMessages.push(messages[i])
            }
        }
        
        res.status(200).send(userMessages);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// router.post('/message/reply', async (req, res) => {
//     try {
//         const channelAccessToken = 'BSSh/9n/cVM/TkpSPznYrhB1OR7OdfISXyJOhE/OA3h9pnEJJVXYkZHdYNb0m6CzZn0WiZSuBu7tbSsEScpRzJhWOxmiL5W2Ad3irwndKnkyEPrjS4hyulBd7V+KTW8h7RHo4+Z5fonY8ecEezDV2QdB04t89/1O/w1cDnyilFU=';
//         const replyToken = '45ea57b964004575b5104f455224e0ba';
//         const messages = [
//             {
//                 type: 'text',
//                 text: 'Hello, user'
//             },
//             {
//                 type: 'text',
//                 text: 'May I help you?'
//             }
//         ];

//         const response = await axios.post('https://api.line.me/v2/bot/message/reply', {
//             replyToken,
//             messages
//         }, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${channelAccessToken}`
//             }
//         });

//         console.log(response.data);
//         res.status(200).send(response.data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// });

router.post('/content', async (req, res) => {
    const message = req.body.message
    const channelAccessToken = await ApplicationService.getChannelAccessToken(message.chatbot_id)

    try {
        const contentBinary = await Line.getContent(message.message.id, channelAccessToken);
        // const base64ImageData = contentBinary.toString('base64');
        res.json({ imageData: contentBinary }); // Send as a JSON object
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching image data');
    }
});

export default router;