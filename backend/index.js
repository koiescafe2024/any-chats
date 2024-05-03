import express from 'express';
import cors from 'cors';
import admin from "./apis/admin.js";
import line from "./apis/lineapi.js";
import files from "./apis/files.js";
import expressWs from 'express-ws';
import DatabaseService from './services/db.js';
import ApplicationService from './services/appservice.js';



const serverPort=9000;
const app = express();
expressWs(app);
app.use(express.json({ limit: "10mb" }));

app.use(cors(
    {
        origin: [
            "https://181f-2401-4900-1c2b-c482-ac7c-f0cf-7e28-ac0b.ngrok-free.app",
            "http://localhost:3000",
            "http://localhost:9000",
            "http://localhost:80",
            "https://olll-cha-ts-backend.6o1yzt.easypanel.host:9000",
            "https://olll-cha-ts-backend.6o1yzt.easypanel.host",
            "https://olll-cha-ts-frontend.6o1yzt.easypanel.host:80",
            "https://olll-cha-ts-frontend.6o1yzt.easypanel.host"

            
          ],
    credentials: true
    }
));
app.use("/admin", admin);
app.use("/files", files);
app.use("/line", line);

app.get("/", (req, res) => {
  res.sendStatus(200);
});



app.post("/chatbot/:id", async (req, res) => {
  const chatbot_id = req.params.id
  const webhookEvents = req.body.events
 // console.log(webhookEvents[0])

  // store in db
  for (let i=0; i<webhookEvents.length; i++){
      
      if (webhookEvents[i].type === "leave"){
          console.log("Message type 'leave' unhandled")
      }
      else if (webhookEvents[i].type === "unfollow"){
          // remove all messages
          ApplicationService.removeUser(webhookEvents[i].source.userId, parseInt(chatbot_id))
      }
      else if (webhookEvents[i].type === "follow"){
          webhookEvents[i].type = "message";
          webhookEvents[i].message = {
              type: "text",
              text: "Welcome message..."
            },
          webhookEvents[i].created_at = Date.now()
          webhookEvents[i].chatbot_id = parseInt(chatbot_id)
          webhookEvents[i].status = "Unread"
          webhookEvents[i].source.type = "system"

          await DatabaseService.addObject("messages", webhookEvents[i])
      } else {

          webhookEvents[i].created_at = Date.now()
          webhookEvents[i].chatbot_id = parseInt(chatbot_id)
          webhookEvents[i].status = "Unread"


          await DatabaseService.addObject("messages", webhookEvents[i])
      }
  }

  // sends to all frontend, must store identifier somewhere, send in websocket url
  for (const connectionId in frontendClients) {
      const frontendWebSocket = frontendClients[connectionId];
      frontendWebSocket.ws.send(`{"sender": "User", "chatbot_id": ${chatbot_id}}`)

      console.log("Command sent to frontend!")
  }

  res.sendStatus(200)
})

app.post("/admin/online", async (req, res) => {
  try {
      const uniqueAdminEmails = new Set(); // Use a Set to track unique emails
      const fetchAdminPromises = [];

      for (const connectionId in frontendClients) {
       
          const frontendWebSocket = frontendClients[connectionId];
        //  console.log("frontend clients.."+frontendWebSocket.user_id);

          const promise = parseInt(frontendWebSocket.user_id)
             
                  const email = 'admin@gmail.com';
                  uniqueAdminEmails.add(email);
                  
              
              
          fetchAdminPromises.push(promise);

      }

      await Promise.all(fetchAdminPromises);

      const admins = Array.from(uniqueAdminEmails).map(email => ({ admin: email }));
      res.send(admins);
  } catch (err) {
      console.log(err);
      res.status(500).send({ error: "An error occurred while fetching online admins." });
  }
});

const frontendClients = {};
app.ws("/frontend/:user_id/:profile_id", async (ws, req) => {
  const connectionId = Math.random().toString(36).substring(2);
  frontendClients[connectionId] = {
      ws: ws,
      user_id: req.params.user_id,
      profile_id: req.params.profile_id,
  }

  console.log('Connection established to frontend'); // Log when the connection is established
  
  ws.on('message', async (message) => {
      console.log(`Received message from frontend: ${message}`);
      const socketMessage = JSON.parse(message) 

      const channelAccessToken = await ApplicationService.getChannelAccessToken(socketMessage.chatbot_id)
      if (socketMessage.messages.length !== 0){
          const sentMessage = await Line.pushMessage(socketMessage.messages, socketMessage.user_id, channelAccessToken)
          console.log(sentMessage)

          if (sentMessage){
              for (let i=0; i<sentMessage.sentMessages.length; i++){
                  // socketMessage and sentMessage has the same length
                  let dbMessage = {
                      timestamp: Date.now(),
                      type: "message",
                      chatbot_id: socketMessage.chatbot_id,
                      message: socketMessage.messages[i],
                      source: {
                          type: socketMessage.admin.email,
                          userId: socketMessage.user_id,
                      }
                      // status: "created"
                  }
                  dbMessage.message.id = sentMessage.sentMessages[i].id;
                  dbMessage.message.quoteToken = sentMessage.sentMessages[i].quoteToken;
  
                  await DatabaseService.addObject("messages", dbMessage)
              }
              for (const connectionId in frontendClients) {
                  const frontendWebSocket = frontendClients[connectionId];
                  console.log("frontend socket.."+frontendWebSocket.email);
                //   if (socketMessage.user_id === parseInt(frontendWebSocket.user_id)){
                      frontendWebSocket.ws.send(`{"sender": "Admin", "chatbot_id": ${socketMessage.chatbot_id}}`)
                      console.log("Command sent to frontend!")
                  // }
              }
          }
      }
  });

  ws.on('error', (error) => {
      console.error('WebSocket error (frontend):', error);
  });

  ws.on('close', () => {
      console.log('Frontend disconnected'+connectionId);
      // You can handle disconnection here, if needed
      delete frontendClients[connectionId]
  });
});

app.listen(serverPort, err =>{
  err 
  ? console.log("Error in server setup") 
  : console.log(`Worker with process ${process.pid} started`);
});


