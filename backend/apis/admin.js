import express from 'express';
import axios from "axios"
import DatabaseService from '../services/db.js';
import Line from '../services/line.js';

const router = express.Router();

router.get('/', async (req, res) => {
});

router.post('/bots/chat/get', async (req, res) => {
    const { admin_id } = req.body;//admin_id=profile_id from frontend
    
    try {
        const chatbots = await DatabaseService.readFile("../jsonfiles/chatbots.json")
       // console.log(chatbots)
        let admin_bots = [];
        for (let i=0; i<chatbots.length; i++){
            for (let j=0; j<chatbots[i].admins.length; j++){
                if (chatbots[i].admins[j] === parseInt(admin_id)){//match admins array in chatbot with profile_id from frontend
                    admin_bots.push(chatbots[i])
                }
            }
        }

        res.status(200).send(admin_bots);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/user/name/set', async (req, res) => {
    const { user_id, chatbot_id, name } = req.body;
    try {
        const users = await DatabaseService.readFile("../jsonfiles/users.json");

        let userFound = false;
        for (let i = 0; i < users.length; i++) {
            if (users[i].user_id === user_id && users[i].chatbot_id === chatbot_id) {
                users[i].editedDisplayName = name;
                userFound = true;
                await DatabaseService.updateFile("../jsonfiles/users.json", users)
                break; // Stop the loop once the user is found and updated
            }
        }

        if (!userFound) {
            const user = {
                user_id: user_id,
                chatbot_id: chatbot_id,
                editedDisplayName: name
            }
            await DatabaseService.addObject("users", user)
        }

        res.status(200)
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;