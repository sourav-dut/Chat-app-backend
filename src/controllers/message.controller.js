import Message from "../../models/Message.model.js";
import User from "../../models/User.model.js";
import MessageService from "../services/message.service.js";

// get all users except the login user
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.body.user._id;
        const filteredUsers = await MessageService.getUsersForSidebar(loggedInUserId);

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log(`Error in getUsersForSidebar Api- ${error}`);
        return res.status(500).send({
            success: false,
            message: "Error in getUsersForSidebar Api"
        })
    }
};

// get messages
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.body.user._id;

        const messages = await MessageService.getMessages(userToChatId, myId);

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Send Message
export const sendMessage = async (req, res) => {
    try {
      const { text, image } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.body.Messageuser._id;
  
      const newMessage = await MessageService.sendMessage(senderId, receiverId, text, image);
  
    // todo: real time functionlity is here => socket.io
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };